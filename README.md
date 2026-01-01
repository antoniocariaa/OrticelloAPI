# OrticelloAPI
Express API system for Orticello, a web application for Gardening management in community gardens.

## Presentazione del Team
Ali Raja Faizan, Caria Antonio, Pedron Federico 

### TO DO

#### Testing
- [x] Test classes for all working modules
- [ ] Integration tests for authentication flows
- [ ] E2E tests for main user stories

#### User Story 2 - Search & Map (RF2)
- [ ] **Search filters implementation**:
  - [ ] Filter by zone/area
  - [ ] Filter by availability status
  - [ ] Filter by sensor presence
  - [ ] Filter by plot size
- [ ] Backend API for filtered search with multiple criteria

#### User Story 4 - Plot Request (RF6.3)
- [ ] **Request submission system**:
  - [ ] Validation: user must not have existing assignments
  - [ ] Request status: "pending"
- [ ] **Notification system** for request confirmation
- [ ] Backend API for creating and managing plot requests
- [ ] Request model/schema in database

#### User Story 6 - Notice Management (RF19, RF27)
- [ ] **Notice visibility system**:
  - [ ] Municipality: "Public" and "Associations Only" options
  - [ ] Association: auto-targeting to their citizens

#### User Story 7 - Notice Consultation (RF3)
- [ ] **Notice filtering** by:
  - [ ] Issuing entity (Municipality/Association)
  - [ ] Date range
  - [ ] Category
- [ ] **Read/Unread status tracking**:
  - [ ] Mark as read functionality
  - [ ] Visual indicators for unread notices
  - [ ] User-notice read status model
- [ ] **Notice history** preservation
- [ ] Backend logic for user-specific notice visibility
- [ ] API endpoint for filtered notices by authenticated user

#### User Story 8 - Competition Announcements (RF15.1)
- [ ] **PDF file upload** for bando documents
- [ ] **File validation** (PDF format, size limits)
- [ ] **File storage system** (local/cloud)
- [ ] **Mandatory field validation** (name, deadline, PDF)

#### User Story 9 - Bando Consultation (RF26)
- [ ] **Active bando filtering** (future deadline only)
- [ ] **PDF download functionality** for each bando

#### User Story 10 - Citizen Registration (RF5)
- [ ] **Email confirmation system**:
  - [ ] Email service configuration
  - [ ] Confirmation email template
  - [ ] Email sending after registration
- [ ] **Enhanced duplicate checking**:
  - [ ] Codice Fiscale uniqueness validation
- [ ] Registration success feedback

#### User Story 11 - Request Management (RF25)
- [ ] **Request management dashboard** for associations:
  - [ ] List of pending requests
  - [ ] Request filtering (zone, priority, date)
  - [ ] Citizen details display
- [ ] **Approval workflow**:
  - [ ] Assignment duration input
  - [ ] Plot status update to "occupied"
  - [ ] Create affidaLotto record
  - [ ] Citizen notification of approval
- [ ] **Rejection workflow**:
  - [ ] Rejection reason field
  - [ ] Citizen notification with reason
- [ ] Backend API for request approval/rejection
- [ ] Notification system (email/in-app)

#### Advanced Features
- [ ] **Geospatial queries**:
  - [ ] Query by distance from coordinates
  - [ ] Query by geographic boundaries
  - [ ] Optimize 2dsphere indexes usage
- [ ] **Sensor data management**:
  - [ ] Date range queries for sensor readings
  - [ ] Location-based sensor queries
  - [ ] Latest reading optimization
  - [ ] Data aggregation and statistics
- [ ] **Weather data management**:
  - [ ] Date range queries for weather data
  - [ ] Location-based weather queries
  - [ ] Latest reading optimization
- [ ] **Role-based access control**:
  - [ ] Apply checkRole middleware to protected routes
  - [ ] Define permissions matrix for each endpoint
  - [ ] Admin-specific functionalities
- [ ] **Audit logging** for critical operations
- [ ] **Email notification system** (SendGrid/Nodemailer)
- [ ] **In-app notification system**

---

## API Endpoints Implementation Status

### 1. affidaLottoController.js 📦 (Plot Assignment & Requests)
| Method | Verb | Role | Status | Description / Requirements |
|--------|------|------|--------|---------------------------|
| `addColtura` | POST | `citt` | ✅ DONE | **RF7**: Citizen adds what they're cultivating |
| `removeColtura` | DELETE | `citt` | ✅ DONE | **RF7**: Citizen removes a crop |
| `getAllAffidaLotti` | GET | `asso, comu` | ✅ DONE | **RF100**: Assignment history |
| `getAffidaLottoById` | GET | `All` | ✅ DONE | Assignment details |
| `createAffidaLotto` | POST | `comu, asso` | ✅ DONE | Manual assignment (bypass request) |
| `updateAffidaLotto` | PUT | `comu, asso` | ✅ DONE | Update assignment details |
| `deleteAffidaLotto` | DELETE | `comu, asso` | ✅ DONE | Revoke assignment / End mandate |

**Priority Tasks:**
- [ ] Implement `richiediLotto` endpoint for citizen plot requests
- [ ] Implement `getRichiestePendenti` to list pending requests for associations
- [ ] Implement `gestisciRichiesta` with approval/rejection logic
- [ ] Create `Richiesta` model/schema for plot requests
- [ ] Add role-based access control middleware to all endpoints

### 2. bandoController.js 📜 (Competition Announcements)
| Method | Verb | Role | Status | Description / Requirements |
|--------|------|------|--------|---------------------------|
| `createBando` | POST | `comu` | ✅ DONE | **RF15**: Municipality publishes new bando |
| `deleteBando` | DELETE | `comu` | ✅ DONE | **RF15**: Municipality removes bando |
| `getAllBandi` | GET | `All` | ✅ DONE | **RF26**: List of bandi visible to all (or logged users) |
| `getBandoById` | GET | `All` | ✅ DONE | **RF26.2**: Bando details for application |
| `updateBando` | PUT | `comu` | ✅ DONE | Correction of errors in bando |
| `getActiveBandi` | GET | `Comu, Asso` | ✅ DONE | **RF26**: Only active bandi (deadline not passed) |

**Priority Tasks:**
- [ ] Implement `getActiveBandi` to filter bandi with future deadlines
- [ ] Add PDF file upload functionality to `createBando`
- [ ] Add file storage system (local/cloud)
- [ ] Add file validation (PDF only, size limits)
- [ ] Add role-based access control middleware

### 3. avvisoController.js 📢 (Notices & Communications)
| Method | Verb | Role | Status | Description / Requirements |
|--------|------|------|--------|---------------------------|
| `createAvviso` | POST | `comu, asso` | ✅ DONE | **RF19, RF27**: Municipality or Association creates notices |
| `getAllAvvisi` | GET | `All` | ✅ DONE | **RF3**: Notice board view (filtered by relevance) |
| `getAvvisoById` | GET | `All` | ✅ DONE | Notice details |
| `updateAvviso` | PUT | `comu, asso` | ✅ DONE | Update own notice |
| `deleteAvviso` | DELETE | `comu, asso` | ✅ DONE | Delete notice (only own) |
| `getAvvisiFiltered` | GET | `All` | ✅ DONE | **RF3.4**: Filtered notices (entity, date, category) |
| `markAsRead` | PUT | `All` | ✅ DONE | **RF3**: Mark notice as read |

**Priority Tasks:**
- [ ] Implement notice visibility system (Public, Associations Only, Association-specific)
- [ ] Add `target` field validation in `createAvviso`
- [x] Implement `getAvvisiFiltered` with filtering by entity, date, category
- [x] Implement `markAsRead` endpoint
- [x] Create `AvvisoLetto` model for read/unread tracking
- [x] Add role-based access control middleware

### 4. ortoController.js 🏡 (Garden Management)
| Method | Verb | Role | Status | Description / Requirements |
|--------|------|------|--------|---------------------------|
| `createOrto` | POST | `comu` | ✅ DONE | **RF16**: Municipality registers new garden space |
| `updateOrto` | PUT | `comu` | ✅ DONE | Modify data (e.g., address, number of plots) |
| `getAllOrtos` | GET | `All` | ✅ DONE | **RF2**: Map/List of city gardens |
| `getOrtoById` | GET | `All` | ✅ DONE | Single garden details |
| `deleteOrto` | DELETE | `comu` | ✅ DONE | Remove garden (with integrity check) |
| `getOrtosFiltrati` | GET | `All` | ✅ DONE | **RF2.2**: Gardens filtered by zone, availability, sensors, size |

**Priority Tasks:**
- [x] Implement `getOrtosFiltrati` with multiple filter criteria
- [ ] Add geospatial query support for location-based filtering
- [x] Add role-based access control middleware to protected endpoints

### 5. affidaOrtoController.js 🤝 (Garden-Association Assignment)
| Method | Verb | Role | Status | Description / Requirements |
|--------|------|------|--------|---------------------------|
| `assignOrto` (createAffidaOrto) | POST | `comu` | ✅ DONE | **RF18**: Municipality assigns garden management to Association |
| `revokeOrto` (deleteAffidaOrto) | DELETE | `comu` | ✅ DONE | **RF18**: Municipality revokes management |
| `getAllAssignments` (getAllAffidaOrti) | GET | `comu` | ✅ DONE | List of who manages what |
| `getAffidaOrtoById` | GET | `All` | ✅ DONE | Assignment details |
| `updateAffidaOrto` | PUT | `comu` | ✅ DONE | Update assignment details |
| `getActiveAffidaOrti` | GET | `All` | ✅ DONE | Active garden assignments only |

**Priority Tasks:**
- [ ] Add role-based access control middleware to all endpoints
- [ ] Add validation to prevent assignment conflicts

### 6. associazioneController.js 👥 (Association Member Management)
| Method | Verb | Role | Status | Description / Requirements |
|--------|------|------|--------|---------------------------|
| `addMembro` | POST | `asso (Admin)` | ✅ DONE | **RF22**: Association Admin adds collaborator |
| `removeMembro` | DELETE | `asso (Admin)` | ✅ DONE | **RF22**: Association Admin removes collaborator |
| `getMembri` | GET | `asso` | ✅ DONE | List of association staff |
| `createAssociazione` | POST | `comu` | ✅ DONE | Create new association |
| `getAllAssociazioni` | GET | `All` | ✅ DONE | List all associations |
| `getAssociazioneById` | GET | `All` | ✅ DONE | Association details |
| `updateAssociazione` | PUT | `asso (Admin), comu` | ✅ DONE | Update association info |
| `deleteAssociazione` | DELETE | `comu` | ✅ DONE | Remove association |

**Priority Tasks:**
- [x] Implement `addMembro` to add association collaborators
- [x] Implement `removeMembro` to remove collaborators
- [x] Implement `getMembri` to list association members
- [ ] Create member relationship model (utente-associazione)
- [x] Add admin-only access control for member management

### 7. utenteController.js 👤 (User Profile Management)
| Method | Verb | Role | Status | Description / Requirements |
|--------|------|------|--------|---------------------------|
| `updateProfile` (updateUtente) | PUT | `Owner` | ✅ DONE | **RF4**: User modifies own data (phone, address) |
| `deleteProfile` (deleteUtente) | DELETE | `Owner` | ✅ DONE | **RF5**: Account deletion (GDPR) |
| `getProfile` (getUtenteById) | GET | `Owner, comu` | ✅ DONE | View own data |
| `getAllUtenti` | GET | `comu (Admin)` | ✅ DONE | Global monitoring (optional but useful) |
| `createUtente` | POST | `Public` | ✅ DONE | **RF5**: Self-registration |
| `updatePassword` | PUT | `Owner` | ✅ DONE | Change password |

**Priority Tasks:**
- [ ] Add email confirmation system for registration
- [ ] Implement email service integration
- [ ] Add ownership validation (users can only modify their own data)
- [ ] Add role-based access control for `getAllUtenti`

### 8. comuneController.js 🏛️ (Municipality Advanced Administration)
| Method | Verb | Role | Status | Description / Requirements |
|--------|------|------|--------|---------------------------|
| `createUtenteComune` | POST | `comu (Admin)` | ❌ TODO | **RF12**: Create municipal employee profiles |
| `createAssociazioneAdmin` | POST | `comu` | ❌ TODO | **RF14**: Create first Admin profile for new Association |
| `createComune` | POST | `System` | ✅ DONE | Create municipality record |
| `getAllComuni` | GET | `All` | ✅ DONE | List all municipalities |
| `getComuneById` | GET | `All` | ✅ DONE | Municipality details |
| `updateComune` | PUT | `comu (Admin)` | ✅ DONE | Update municipality info |
| `deleteComune` | DELETE | `System` | ✅ DONE | Remove municipality |

**Priority Tasks:**
- [ ] Implement `createUtenteComune` for creating municipal employees
- [ ] Implement `createAssociazioneAdmin` for association initialization
- [ ] Add validation to ensure first association admin creation
- [ ] Add admin-only access control

---

### Implementation Priority

**High Priority (Core User Stories):**
1. Plot request system (`richiediLotto`, `getRichiestePendenti`, `gestisciRichiesta`)
2. Notice visibility and filtering system
3. Active bandi filtering with PDF support
4. Role-based access control on all endpoints

**Medium Priority (Enhanced Features):**
1. Association member management
2. Email confirmation system
3. Municipal employee management
4. Read/unread notice tracking

**Low Priority (Nice to Have):**
1. Advanced filtering for gardens
2. Geospatial queries optimization
3. Audit logging implementation
