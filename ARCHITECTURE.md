# IMEI Checker Application - Architecture Overview

## Project Overview
**IMEI Checker** is a Node.js/Express-based web application for looking up mobile device information by IMEI number and storing query history in MongoDB. The application integrates with the **imeidb.xyz API** for real-time IMEI lookups and maintains a local database of phone model specifications.

---

## 1. Technology Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **API Client**: node-fetch
- **Logging**: Morgan
- **Body Parsing**: body-parser
- **Environment Management**: dotenv

### Frontend
- **Template Engine**: EJS
- **UI Framework**: Semantic UI
- **JavaScript**: ES6+ Modules
- **HTTP Client**: Fetch API

### Testing & Development
- **Test Framework**: Jest
- **Test HTTP Client**: Supertest
- **Development Server**: Nodemon

---

## 2. Project Structure

```
/home/user/ImeiChecker/
├── models/                 # Database schemas (Mongoose)
│   ├── imei.js            # Historical IMEI request logs
│   ├── imei1.js           # Alternative IMEI results storage
│   ├── phoneModel.js      # Phone specification details
│   └── index.js           # Model exports
├── routes/                # API and HTML route handlers
│   ├── api-routes.js      # RESTful API endpoints (IMEI lookup, phone models)
│   └── html-routes.js     # View rendering and page routes
├── public/                # Frontend static assets
│   ├── index.html         # Main application page
│   ├── imei_stats.html    # Statistics/dashboard page
│   ├── api.js             # API client wrapper (ES6 module)
│   ├── index.js           # Main application logic
│   ├── funk.js            # IMEI data processing and rendering
│   ├── stats.js           # Statistics handling
│   ├── funk1.js           # Alternative processing logic
│   └── assets/
│       └── css/
│           └── style.css  # Application styling
├── seeders/               # Database seed scripts
│   └── seed.js            # Initial data population
├── tests/                 # Test suite
│   └── api.test.js        # API integration tests
├── .github/
│   └── workflows/         # CI/CD pipelines
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
├── package-lock.json      # Lock file
├── .env.example           # Environment variables template
├── README.md              # Project documentation
└── LICENSE                # MIT License

```

---

## 3. Database Models & Schemas

### 3.1 Imei Model (`/models/imei.js`)
**Collection**: `imeis`
```javascript
{
  day: Date (default: current timestamp),
  requests: [{
    country: String (required),
    type: String (required),
    value: String (required),
    username: String (required),
    response: String (optional)
  }]
}
```
**Purpose**: Stores historical IMEI query logs grouped by date.

### 3.2 Imei1 Model (`/models/imei1.js`)
**Collection**: `imei1s`
```javascript
{
  day: Date (default: current timestamp),
  requests: {} // Flexible object structure for API responses
}
```
**Purpose**: Alternative storage for IMEI lookup results with flexible schema.

### 3.3 PhoneModel Schema (`/models/phoneModel.js`)
**Collection**: `phonemodels`
```javascript
{
  model: String (required, unique) // e.g., "SM-G991U"
  modelName: String // e.g., "Galaxy S21"
  deviceImage: String // Image URL
  netTech: String // Network technology (2G/3G/4G/5G)
  speed: String // Connection speeds
  bands: {
    twoG: [String],      // GSM bands
    wcdma: [String],     // WCDMA/3G bands
    lte: [String]        // LTE/4G bands
  },
  scores: {
    att4g: Number,       // AT&T 4G compatibility score (0-100)
    tmobile4g: Number,   // T-Mobile 4G compatibility score (0-100)
    verizon4g: Number    // Verizon 4G compatibility score (0-100)
  },
  compatibleModels: [String], // List of compatible device models
  note: String // Optional user notes
}
```
**Purpose**: Caches phone specifications and band compatibility data.

---

## 4. API Endpoints & IMEI Checking Logic

### 4.1 Core IMEI Lookup Endpoints

#### **GET `/api/imei1F/:imei`** (Primary IMEI Lookup)
- **Purpose**: Lookup IMEI with caching mechanism
- **Flow**:
  1. Check if IMEI exists in local `Imei1` collection (cache hit)
  2. If cached, update phone model info and return
  3. If not cached, fetch from imeidb.xyz API
  4. Save API response to `Imei1` collection
  5. Extract and persist phone model details to `PhoneModel` collection
- **Response**: JSON with device info from API or cache
- **Error Handling**: Returns 400 for validation errors, 500 for server errors

#### **GET `/result1/:imei`** (Direct API Passthrough)
- **Purpose**: Direct lookup without caching
- **Flow**: Directly calls imeidb.xyz API and returns response
- **Response**: Raw API response as JSON
- **Error Handling**: Returns 500 if API call fails

#### **GET `/result1?search=<imei>`** (HTML Form Submission)
- **Purpose**: HTML page rendering with IMEI lookup
- **Response**: EJS template with device data

### 4.2 Phone Model CRUD Endpoints

#### **GET `/api/phone-model/:model`**
- Retrieves stored phone model specifications
- Returns 404 if model not found

#### **POST `/api/phone-model`**
- Creates new phone model record
- Checks for duplicates before creation

#### **PUT `/api/phone-model/:model`**
- Updates existing phone model
- Runs validators and returns updated record
- Returns 404 if model not found

### 4.3 IMEI History Endpoints

#### **GET `/api/imeis`**
- Returns all IMEI request logs (sorted by date, newest first)

#### **GET `/api/imeis/range`**
- Returns last 7 IMEI request logs

#### **GET `/api/imei1`**
- Returns all IMEI1 collection records

#### **POST `/api/requests1`**
- Creates new IMEI request log entry

#### **PUT `/api/imeis/:id`**
- Appends new request to existing IMEI record

#### **DELETE `/api/requests`**
- Removes IMEI request log by ID

### 4.4 Model Creation Endpoints

#### **POST `/api/createmodel`**
- Creates Imei1 record

#### **POST `/api/createmodel2`**
- Creates Imei1 record with duplicate checking
- Searches by `requests.deviceImei`

### 4.5 Data Processing & Caching

#### **updatePhoneModel() Function** (in api-routes.js)
Automatically processes API responses to extract and cache phone model data:
- Extracts device model identifier
- Parses network bands (2G/WCDMA/LTE) from frequency strings
- Calculates carrier compatibility scores:
  - AT&T: checks for bands [2, 4, 14, 30, 17, 12, 66]
  - T-Mobile: checks for bands [2, 4, 5, 66, 12, 71]
  - Verizon: checks for bands [2, 5, 4] (WCDMA)
- Updates or creates PhoneModel record
- Handles both API payload formats (with/without `data` wrapper)

---

## 5. Data Flow & Saving Mechanisms

### 5.1 IMEI Lookup Flow

```
User IMEI Query
       ↓
   API Client (fetch)
       ↓
GET /api/imei1F/:imei
       ↓
   Check Imei1 Cache
       ├─→ Cache Hit → Return cached data
       │                    ↓
       │          Update PhoneModel
       │                    ↓
       │              Return to Client
       │
       └─→ Cache Miss → Fetch from imeidb.xyz API
                              ↓
                       Save to Imei1 Collection
                              ↓
                       Extract phone model data
                              ↓
                       updatePhoneModel() 
                              ↓
                    Create/Update PhoneModel record
                              ↓
                        Return to Client
```

### 5.2 Data Persistence Methods

#### **Method 1: Full IMEI Response Caching (Imei1)**
- **Trigger**: On successful API lookup
- **Storage**: `Imei1` document with entire API response
- **Purpose**: Cache full device info to avoid repeated API calls
- **Schema**: `{ day: Date, requests: {...API response...} }`

#### **Method 2: Phone Model Specification Caching (PhoneModel)**
- **Trigger**: Automatically when IMEI is looked up
- **Storage**: `PhoneModel` document with extracted specs
- **Purpose**: Maintain searchable database of phone specs for compatibility scoring
- **Data Extraction**:
  - Device model identifier
  - Device name and image
  - Network technology specs
  - Band information (2G/WCDMA/LTE)
  - Carrier compatibility scores

#### **Method 3: IMEI Request Logging (Imei)**
- **Trigger**: Manual API calls (less common in current implementation)
- **Storage**: `Imei` collection with request metadata
- **Purpose**: Audit trail of user queries
- **Schema**: `{ day: Date, requests: [{country, type, value, username, response}] }`

### 5.3 API Response Payload Support

The application supports multiple payload formats from imeidb.xyz:
1. **Wrapped format**: `{ data: { models: [], ...specs } }`
2. **Direct format**: `{ models: [], ...specs }`
3. **Simplified format** (from cache): Pre-parsed band arrays and scores

---

## 6. Frontend Architecture

### 6.1 API Client Module (`public/api.js`)
Provides interface to backend endpoints:

**Key Methods**:
- `oneImeiDb(imei, callback)` - Cached IMEI lookup with fallback to callback
- `getPhoneModel(model)` - Fetch phone model details
- `updatePhoneModel(model, data)` - Update phone model info
- `createPhoneModel(data)` - Create new phone model
- `getAllImei1()` - Fetch all cached IMEI records
- `getImeisInRange()` - Get last 7 IMEI queries

### 6.2 Data Processing (`public/funk.js`)
Handles IMEI response processing and UI rendering:

**Main Function**: `processImeiActual(response, type)`
- Parses device information from API response
- Extracts frequency bands and categorizes by type:
  - LTE FDD bands → `lte` array
  - WCDMA FDD bands → `wcdma` array
  - GSM → `twoG` array
- Calculates carrier compatibility scores
- Renders UI with device details
- Optionally saves to database (if `type === "api_result"`)
- Fetches and displays stored model info

**Helper Functions**:
- `saveTodatabase(info)` - Persist IMEI data to Imei1 collection
- `ensurePhoneModel(info)` - Create PhoneModel record if not exists
- `renderResults(info)` - Build HTML tables with device details

### 6.3 Main Application Logic (`public/index.js`)
Handles user interactions and flow control:
- Form input validation (IMEI, email, country)
- IMEI query submission
- Toast notifications for user feedback
- Database update (save request history)
- Route management

### 6.4 User Interface (`public/index.html`)
Single-page application with:
- IMEI search form
- Country selector
- Results display (scores, device specs)
- Phone model update form
- Device statistics display

---

## 7. Current Caching & Data Saving Strategies

### 7.1 Caching Mechanisms

| Type | Location | Key | Hit Condition | Benefits |
|------|----------|-----|---------------|----------|
| **API Response Cache** | Imei1 Collection | deviceImei | Query by deviceImei field | Avoids redundant API calls |
| **Phone Model Cache** | PhoneModel Collection | model | Query by model field | Fast compatibility scoring |
| **Calculated Scores** | PhoneModel.scores | - | Stored with model | Pre-computed compatibility |

### 7.2 Data Saving Triggers

1. **Automatic on IMEI Lookup**:
   - When `/api/imei1F/:imei` is called
   - Both Imei1 and PhoneModel records are created/updated
   - `updatePhoneModel()` extracts and caches specifications

2. **Manual via Frontend**:
   - User submits search form → saves request to Imei collection
   - User updates model info → PUT `/api/phone-model/:model`

3. **Seed Data**:
   - `npm run seed` populates Imei collection with sample data

---

## 8. Environment Configuration

**Required Environment Variables** (from `.env.example`):
```
MONGODB_URI=mongodb://localhost:27017/your-db
IMEI_API_TOKEN=your_api_token_here
PORT=3002
```

---

## 9. Testing & Quality Assurance

### Test Suite (`tests/api.test.js`)
Uses Jest with mocked database models:

**Test Cases**:
1. `GET /api/imei1F/:imei` - Tests caching and API fallback
2. `GET /result1/:imei` - Tests direct API passthrough
3. `PUT /api/phone-model/:model` - Tests model updates

**Mocking Strategy**:
- Mocks Imei1 and PhoneModel models
- Mocks global fetch for API calls
- Validates database interactions

---

## 10. Key Design Patterns

### 10.1 Caching with Fallback
```javascript
// Check cache first
let cached = await Imei1.findOne({ "requests.deviceImei": imei });
if (cached) return cached;

// Fallback to API
const apiData = await fetch(...);
await Imei1.create({ requests: apiData });
return apiData;
```

### 10.2 Automatic Data Enrichment
Phone model data is automatically extracted and persisted whenever an IMEI is queried, enriching the database over time.

### 10.3 Flexible Payload Handling
Support for multiple API response formats (wrapped/direct/simplified) ensures compatibility across different data sources.

---

## 11. Scalability Considerations

### Current Bottlenecks
- Single MongoDB instance
- No database indexing optimization documented
- No rate limiting on API endpoints
- No pagination on list endpoints

### Recommended Improvements
1. Add MongoDB indexes on `requests.deviceImei` for faster cache lookups
2. Implement rate limiting for external API calls
3. Add pagination to list endpoints
4. Implement Redis for in-memory caching
5. Add request validation and sanitization middleware

---

## 12. Security Notes

### Current Implementation
- Basic authentication placeholder (hardcoded username/password in html-routes.js)
- No input validation on IMEI format
- No CORS headers configured
- API token stored in environment variable

### Recommended Enhancements
1. Implement proper authentication/authorization
2. Validate IMEI format (15-digit number)
3. Add CORS middleware configuration
4. Implement request logging and monitoring
5. Add data validation middleware

