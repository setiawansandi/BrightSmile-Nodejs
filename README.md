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
      "email": "alice@example.com",
      "avatarUrl": null
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
      "email": "alice@example.com",
      "avatarUrl": "assets/images/user1.png"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

---

## 👤 User Endpoints

### **3. Get User Profile**

**Endpoint:** `GET /api/user`  
**Requires JWT:** ✅  
**Description:** Retrieve the currently logged-in user's profile information.

#### **Headers**

```
Authorization: Bearer <ACCESS_JWT>
```

#### **Success Response**

```json
{
  "code": 200,
  "data": {
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1990-05-15",
    "avatarUrl": "https://example.com/avatars/john.png",
    "phone": "+1234567890",
    "is_doctor": 0
  }
}
```

## 👨‍⚕️ Doctor Endpoints

### **4. Get Doctors**

**Endpoint:** `GET /api/doctor`  
**Requires JWT:** ❌  
**Description:** Retrieve a list of all doctors with info

#### **Headers**

```
Authorization: Bearer <ACCESS_JWT>
```

#### **Success Response**

```json
{
  "code": 200,
  "data": [
    {
      "doctor_id": 1,
      "doctor_name": "Nicholas Bedasso",
      "avatar_url": "assets/images/doc1.png",
      "specialization": "General Dentistry",
      "bio": "Dr Nicholas Bidasso graduated from the University of Melbourne, Australia, with a Bachelor of Dental Surgery. He returned to Singapore and served his bond in the public sector, gaining broad experience at various polyclinics and the Health Promotion Board. This period provided him with a strong foundation in community dental care, preventive dentistry, and managing patients of all ages. After his public service, he transitioned to private practice before joining SmileFocus Dental. Dr Bidasso is a firm believer in patient-first dentistry, emphasizing clear communication and gentle care to help anxious patients feel comfortable."
    },
    {
      "doctor_id": 3,
      "doctor_name": "Zhang Jing",
      "avatar_url": "assets/images/doc3.png",
      "specialization": "Orthodontics",
      "bio": "Dr Zhang Jing received his Bachelor of Dental Surgery from the National University of Singapore (NUS). After a few years in general practice, he pursued his specialist training and obtained a Master of Dental Surgery in Orthodontics from NUS. He is a registered specialist with the Singapore Dental Council and practiced at the National Dental Centre Singapore, handling complex braces and aligner cases. Dr. Zhang is passionate about the functional and aesthetic benefits of a well-aligned bite. He is dedicated to using modern digital technologies to create precise, effective treatment plans for both children and adults."
    },
    ...
  ]
}
```

---

## 📅 Appointment Endpoints

### **5. Get Appointments (by User)**

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

### **6. Check Doctor Availability**

**Endpoint:** `GET /api/appointment/schedule?doctor=:id&date=:date&apptId:id`  
**Requires JWT:** ✅  
**Description:** Retrieve booked appointment slots for a given doctor and date. Each item indicates the booked time (slot) and whether the booking belongs to the caller (is_mine).

#### **Headers**

```
Authorization: Bearer <ACCESS_JWT>
```

#### **Example Request**

```
GET /api/appointment/schedule?doctor=2&date=2025-11-28&apptId=14
```

#### **Success Response**

```json
{
  "code": 200,
  "data": [
    { "slot": "09:00", "is_mine": false },
    { "slot": "10:00", "is_mine": false },
    { "slot": "15:00", "is_mine": true }
  ]
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

### **7. Create Appointment**

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

### **8. Update Appointment**

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

| #   | Method | Endpoint                                      | Requires JWT | Body | Description                |
| --- | ------ | --------------------------------------------- | ------------ | ---- | -------------------------- |
| 1   | POST   | `/auth/register`                              | ❌           | ✅   | Create new user            |
| 2   | POST   | `/auth/login`                                 | ❌           | ✅   | Login and get JWT          |
| 3   | GET    | `/user`                                       | ✅           | ❌   | Get logged-in user profile |
| 4   | GET    | `/doctor`                                     | ✅           | ❌   | List doctors               |
| 5   | GET    | `/appointment?user=:id`                       | ✅           | ❌   | List appointments for user |
| 6   | GET    | `/appointment/schedule?doctor=:id&date=:date` | ✅           | ❌   | Check doctor’s schedule    |
| 7   | POST   | `/appointment`                                | ✅           | ✅   | Create appointment         |
| 8   | PUT    | `/appointment`                                | ✅           | ✅   | Update appointment         |
