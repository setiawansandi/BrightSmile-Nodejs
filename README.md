# 🩺Dental Appointment API

This API allows patients and doctors to register, log in, and manage appointments.  
All responses follow a consistent structure with `code`, `data`, and (if applicable) `error` fields.

---

## 🔐 Authentication Endpoints

### **1. Register**
**Endpoint:** `POST /api/auth/register`  
**Requires JWT:** ❌  
**Body Required:** ✅  
**Description:** Create a new user account.

#### **Request**
```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "dob": "1990-01-01",
  "phone": "5551234567",
  "email": "alice@example.com",
  "password": "mypassword"
}
```

#### **Success Response**
```json
{
  "code": 200,
  "data": {
    "user": {
      "id": 1,
      "firstName": "Alice",
      "lastName": "Smith",
      "email": "alice@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

#### **Error Response**
```json
{ "code": 400, "error": "invalid input" }
```

---

### **2. Login**
**Endpoint:** `POST /api/auth/login`  
**Requires JWT:** ❌  
**Body Required:** ✅  
**Description:** Authenticate user and retrieve JWT.

#### **Request**
```json
{
  "email": "alice@example.com",
  "password": "mypassword"
}
```

#### **Success Response**
```json
{
  "code": 200,
  "data": {
    "user": {
      "id": 1,
      "firstName": "Alice",
      "lastName": "Smith",
      "email": "alice@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

---

## 👨‍⚕️ Doctor Endpoints

### **3. Get Doctors**
**Endpoint:** `GET /api/doctor`  
**Requires JWT:** ✅  
**Description:** Retrieve a list of all doctors.

#### **Headers**
```
Authorization: Bearer <ACCESS_JWT>
```

#### **Success Response**
```json
{
  "code": 200,
  "data": [
    { "doctor_id": 1, "doctor_name": "Nicholas Bedasso" },
    { "doctor_id": 2, "doctor_name": "Bond Burger" }
  ]
}
```

---

## 📅 Appointment Endpoints

### **4. Get Appointments (by User)**
**Endpoint:** `GET /api/appointment?user=:id`  
**Requires JWT:** ✅  
**Description:** Get a list of appointments for a specific user (doctor or patient).

#### **Headers**
```
Authorization: Bearer <ACCESS_JWT>
```

#### **Success Response (Doctor View)**
```json
{
  "code": 200,
  "data": [
    {
      "appointment_id": 9001,
      "patient_id": 501,
      "patient_name": "Whay Yu Kham",
      "doctor_id": 101,
      "doctor_name": "Dr. Amina Chow",
      "status": "completed",
      "date": "30/10/2025",
      "time": "15:00",
      "status_label": "confirmed"
    },
    {
      "appointment_id": 8722,
      "patient_id": 501,
      "patient_name": "Whay Yu Kham",
      "doctor_id": 101,
      "doctor_name": "Amina Chow",
      "status": "completed",
      "date": "01/09/2025",
      "time": "15:00",
      "status_label": "completed"
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 2
}
```

---

### **5. Check Doctor Availability**
**Endpoint:** `GET /api/appointment/schedule?doctor=:id&date=:date`  
**Requires JWT:** ✅  
**Description:** Retrieve booked slots for a doctor on a given date.

#### **Headers**
```
Authorization: Bearer <ACCESS_JWT>
```

#### **Example Request**
```
GET /api/appointment/schedule?doctor=12&date=2025-11-03
```

#### **Success Response**
```json
{
  "code": 200,
  "data": ["09:00", "10:00", "15:00"]
}
```

#### **Error Responses**
```json
{ "code": 400, "error": "invalid input" }
```

```json
{ "code": 500, "error": "server error" }
```

---

### **6. Create Appointment**
**Endpoint:** `POST /api/appointment`  
**Requires JWT:** ✅  
**Body Required:** ✅  
**Description:** Create a new appointment for a patient.

#### **Headers**
```
Authorization: Bearer <ACCESS_JWT>
```

#### **Request**
```json
{
  "doctor_id": 12,
  "appt_date": "2025-11-03",
  "appt_time": "14:00"
}
```

#### **Success Response**
```json
{
  "code": 200,
  "data": {
    "appointment_id": 4317
  }
}
```

#### **Error Responses**
```json
{ "code": 400, "error": "invalid input" }
```
```json
{ "code": 500, "error": "server error" }
```

---

### **7. Update Appointment**
**Endpoint:** `PUT /api/appointment`  
**Requires JWT:** ✅  
**Body Required:** ✅  
**Description:** Update an existing appointment.

#### **Headers**
```
Authorization: Bearer <ACCESS_JWT>
```

#### **Request**
```json
{
  "appt_id": 231,
  "doctor_id": 12,
  "appt_date": "2025-11-03",
  "appt_time": "14:00"
}
```

#### **Success Response**
```json
{
  "code": 200,
  "data": {
    "appointment_id": 4317
  }
}
```

#### **Error Responses**
```json
{ "code": 400, "error": "invalid input" }
```
```json
{ "code": 500, "error": "server error" }
```

---

## 📘 Summary Table

| # | Method | Endpoint | Requires JWT | Body | Description |
|---|---------|-----------|---------------|------|--------------|
| 1 | POST | `/auth/register` | ❌ | ✅ | Create new user |
| 2 | POST | `/auth/login` | ❌ | ✅ | Login and get JWT |
| 3 | GET | `/doctor` | ✅ | ❌ | List doctors |
| 4 | GET | `/appointment?user=:id` | ✅ | ❌ | List appointments for user |
| 5 | GET | `/appointment/schedule?doctor=:id&date=:date` | ✅ | ❌ | Check doctor’s schedule |
| 6 | POST | `/appointment` | ✅ | ✅ | Create appointment |
| 7 | PUT | `/appointment` | ✅ | ✅ | Update appointment |
