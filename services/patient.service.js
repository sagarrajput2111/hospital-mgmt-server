import Patient from "../models/patient.js";
import Invoice from "../models/invoice.js";

const gstPercentage = 18;
const bedChargesPerDay = 1000;
const registrationCharges = 1500;
const doctorChargesPerServe = 700;

export const admitPatient = async (patientData) => {
  try {
    // Create a new patient record in the database
    const newPatient = new Patient(patientData);
    await newPatient.save();

    return {
      success: true,
      message: "Patient admitted successfully",
      patient: newPatient,
    };
  } catch (error) {
    console.error("Error admitting patient:", error);
    return {
      success: false,
      message: "An error occurred while admitting the patient",
      error: error.message,
    };
  }
};

export const getAllPatients = async () => {
  try {
    // Fetch all patients from the database
    const patients = await Patient.find({}).select(
      "patientId firstName lastName gender priority bedNumber"
    );

    return {
      success: true,
      message: "Patients fetched successfully",
      patients: patients,
    };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return {
      success: false,
      message: "An error occurred while fetching the patients",
      error: error.message,
    };
  }
};

export const getPatientById = async (patientId) => {
  try {
    // Fetch a patient by their ID from the database
    const patient = await Patient.findOne({ patientId }).select();

    if (!patient) {
      return {
        success: false,
        message: "Patient not found",
      };
    }

    return {
      success: true,
      message: "Patient fetched successfully",
      patient: patient,
    };
  } catch (error) {
    console.error("Error fetching patient by ID:", error);
    return {
      success: false,
      message: "An error occurred while fetching the patient",
      error: error.message,
    };
  }
};

export const getPriorityPatient = async () => {
  try {
    console.log("this the patient array fetched");

    const patient = await Patient.find({
      isDischarged: false, // Optional: only consider admitted patients
    })
      .sort({
        servedCount: 1,
        priority: -1, // Higher number = higher priority (5 > 1)
        addmissionDate: 1, // Earlier date = higher precedence
      })
      .limit(1)
      .exec();

    if (!patient[0]) {
      return {
        success: true,
        message: "No patient available to serve",
        patient: null,
      };
    }

    return {
      success: true,
      message: "Patient fetched successfully",
      patient: patient[0],
    };

    patient[0] || null;
  } catch (error) {
    console.error("Error fetching next patient:", error);
    return {
      success: false,
      message: "Error while fetching patient",
      error: error.message,
    };
  }
};

export const generateInvoice = async (patientId) => {
  try {
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return {
        success: false,
        message: "No patient found",
      };
    }

    const admitDate = new Date(patient.addmissionDate);
    const today = new Date();

    // Difference in full days (minimum 1 day)
    const diffTime = today - admitDate;
    const numberOfDays = Math.max(
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
      1
    );
    const totalDoctorCharge = doctorChargesPerServe * patient.servedCount;
    const totalBedCharge = numberOfDays * bedChargesPerDay;
    const gstCharge =
      ((registrationCharges + totalBedCharge + totalDoctorCharge) *
        gstPercentage) /
      100;
    const totalCharge =
      registrationCharges + totalBedCharge + totalDoctorCharge + gstCharge;
    //create a invoice data
    const invoiceData = new Invoice({
      patient: patient._id,
      doctorCharges: totalDoctorCharge,
      bedCharges: totalBedCharge,
      gstPercentage: gstPercentage,
      gstCharge: gstCharge,
      totalAmount: totalCharge,
    });

    const savedInvoice = await invoiceData.save();

    return {
      success: true,
      message: "Invoice generated successfully",
      invoice: savedInvoice,
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      success: false,
      message: "Server error while creating invoice",
      error: error.message,
    };
  }
};

//get all the invoices with patient details
export const getAllInvoicesWithPatientDetails = async () => {
  try {
    const invoices = await Invoice.find()
      .populate("patient") // Populates the patient field with patient details
      .sort({ createdAt: -1 });
    // Optional: sort by latest invoices
    
    console.log(invoices);
    return {
      success: true,
      message: "Invoices fetched successfully",
      invoices,
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return {
      success: false,
      message: "Error while fetching invoices",
      error: error.message,
    };
  }
};


export const servePatient=async ({patientId,priority,remark})=>{
  try {
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return {
        success: false,
        message: "Patient not found",
      };
    }

    // Update servedCount, priority, and push new remark
    patient.servedCount += 1;

    if (priority) {
      patient.priority = priority;
    }

    patient.remarks.push({
      note: remark.note,
      servedBy: remark.servedBy,
      servedAt: new Date(), // Optional, since schema already sets default
    });

    const updatedPatient = await patient.save();

    return {
      success: true,
      message: "Patient served successfully",
      patient: updatedPatient,
    };
  } catch (error) {
    console.error("Error serving patient:", error);
    return {
      success: false,
      message: "Server error while serving patient",
      error: error.message,
    };
  }
};

export const payInvoice = async ({ _id, paymentMethod, remarks }) => {
  try {
    if (!_id || !paymentMethod) {
      return {
        success: false,
        message: "invoiceId and paymentMethod are required",
      };
    }

    const invoice = await Invoice.findById(_id);
    if (!invoice) {
      return {
        success: false,
        message: "Invoice not found",
      };
    }

    if (invoice.isPaid) {
      return {
        success: false,
        message: "Invoice is already marked as paid",
      };
    }

    invoice.isPaid = true;
    invoice.paidAt = new Date();
    invoice.paymentMethod = paymentMethod;
    if (remarks) {
      invoice.remarks = remarks;
    }

    const updatedInvoice = await invoice.save();

    return {
      success: true,
      message: "Invoice payment successful",
      invoice: updatedInvoice,
    };

  } catch (error) {
    console.error("Error in payInvoice service:", error);
    return {
      success: false,
      message: "Server error while processing payment",
      error: error.message,
    };
  }
};

