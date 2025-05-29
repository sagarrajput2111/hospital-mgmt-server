import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  admitPatientController,
  getAllPatientsController,
  getPatientByIdController,
  getPriorityPatientController,
  generateInvoiceController,
  getAllInvoiceWithPatientController,
  servePatientController,
  payInvoiceController


} from "../controllers/patient.controller.js";

const router = express.Router();
router.use(verifyToken);

router.post("/admit", admitPatientController);
router.get("/all-patients", getAllPatientsController);
router.get("/priority-patient", getPriorityPatientController);
router.get("/invoices",getAllInvoiceWithPatientController);
router.post("/serve-patient",servePatientController);
router.post("/invoice/generate",generateInvoiceController);
router.post("/invoice/pay",payInvoiceController);
router.get("/:patientId", getPatientByIdController);


export default router;
