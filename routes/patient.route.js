import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  admitPatientController,
  getAllPatientsController,
  getPatientByIdController,
  getPriorityPatientController,
  generateInvoiceController

} from "../controllers/patient.controller.js";

const router = express.Router();
router.use(verifyToken);

router.post("/admit", admitPatientController);
router.get("/all-patients", getAllPatientsController);
router.get("/priority-patient", getPriorityPatientController);
router.get("/:patientId", getPatientByIdController);
router.post("/invoice/generate",generateInvoiceController);


export default router;
