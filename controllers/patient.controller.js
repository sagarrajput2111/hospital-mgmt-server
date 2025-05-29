import {
  admitPatient,
  getAllPatients,
  getPatientById,
  getPriorityPatient,
  generateInvoice,
  getAllInvoicesWithPatientDetails,
  servePatient,
  payInvoice
} from "../services/patient.service.js";

export const admitPatientController = async (req, res) => {
  try {
    // Simulate patient admission logic
    const patientData = req.body; // Assuming patient data is sent in the request body
    console.log("Admitting patient with data:", patientData);
    const resData = await admitPatient(patientData);
    if (!resData.success) {
      return res.status(500).json({
        message: resData.message,
        error: resData.error,
      });
    }

    // Here you would typically save the patient data to a database
    // For example: await PatientModel.create(patientData);

    res.status(201).json({
      message: "Patient admitted successfully",
      patient: patientData, // Echo back the admitted patient data
    });
  } catch (error) {
    console.error("Error admitting patient:", error);
    res.status(500).json({
      message: "An error occurred while admitting the patient",
      error: error.message,
    });
  }
};

export const getAllPatientsController = async (req, res) => {
  try {
    // Simulate fetching all patients logic
    console.log("Fetching all patients");
    // Here you would typically fetch the patient data from a database
    const patients = await getAllPatients();
    // Simulated response for demonstration purposes
    if (!patients.success) {
      return res.status(500).json({
        message: patients.message,
        error: patients.error,
      });
    }

    res.status(200).json({
      message: "Patients fetched successfully",
      patients: patients.patients,
    });
  } catch (error) {
    console.log("patient array");
    console.error("Error fetching patients:", error);
    res.status(500).json({
      message: "An error occurred while fetching the patients",
      error: error.message,
    });
  }
};

export const getPatientByIdController = async (req, res) => {
  try {
    console.log("Fetching patient by ID", req.params["patientId"]);
    const patientId = req.params.patientId; // Assuming patientId is passed as a URL parameter
    // console.log("Fetching patient with ID:", patientId);

    // Here you would typically fetch the patient data from a database
    const patient = await getPatientById(patientId);

    if (!patient.success) {
      return res.status(404).json({
        message: patient.message,
      });
    }
    return res.status(200).json({
      message: "Patient fetched successfully",
      patient: patient.patient,
    });
  } catch (error) {
    console.error("Error fetching patient by ID:", error);
    res.status(500).json({
      message: "An error occurred while fetching the patient",
      error: error.message,
    });
  }
};

export const getPriorityPatientController = async (req, res) => {
  try {
    const result = await getPriorityPatient();

    if (!result.success) {
      return res.status(500).json({
        message: result.message,
        error: result.error,
      });
    }

    return res.status(200).json({
      message: result.message,
      patient: result.patient,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error while fetching data",
      error: error.message,
    });
  }
};

export const generateInvoiceController = async (req, res) => {
  try {
    const { patientId } = req.body;

    // Example: You can get charges and servedCount from request body or elsewhere

    const result = await generateInvoice(patientId);

    if (!result.success) {
      return res.status(404).json({
        message: result.message,
      });
    }

    return res.status(201).json({
      message: result.message,
      invoice: result.invoice,
    });
  } catch (error) {
    console.error("Error in generateInvoiceController:", error);
    return res.status(500).json({
      message: "Server error while generating invoice",
      error: error.message,
    });
  }
};

export const getAllInvoiceWithPatientController = async (req, res) => {
  try {
    const result = await getAllInvoicesWithPatientDetails();

    if (!result.success) {
      return res.status(500).json({
        message: result.message,
        error: result.error,
      });
    }

    return res.status(200).json({
      message: result.message,
      invoices: result.invoices,
    });
  } catch (error) {
    console.error("Error in getAllInvoicesController:", error);
    return res.status(500).json({
      message: "Server error while fetching invoices",
      error: error.message,
    });
  }
};

export const servePatientController = async (req, res) => {
  try {
    const { patientId, priority, remark } = req.body;
    console.log(patientId, " ", priority, " ", remark);

    if (!patientId || !remark?.note || !remark?.servedBy) {
      return res.status(400).json({
        message: "patientId, remark.note and remark.servedBy are required",
      });
    }

    const result = await servePatient({ patientId, priority, remark });

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    return res.status(200).json({
      message: result.message,
      patient: result.patient,
    });
  } catch (error) {
    console.error("Error in servePatientController:", error);
    return res.status(500).json({
      message: "Internal server error while serving patient",
      error: error.message,
    });
  }
};

export const payInvoiceController = async (req, res) => {
  try {
    const result = await payInvoice(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      invoice: result.invoice,
    });

  } catch (error) {
    console.error("Unexpected error in payInvoiceController:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
      error: error.message,
    });
  }
};

