// import React, { useState } from "react";

// interface AddAgentFormProps {
//   show: boolean;
//   onHide: () => void;
//   onSubmit: (agentData: AgentFormData) => void;
// }

// export interface AgentFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   address: string;
//   commissionRate: number;
// }

// const AddAgentForm: React.FC<AddAgentFormProps> = ({
//   show,
//   onHide,
//   onSubmit,
// }) => {
//   const [formData, setFormData] = useState<AgentFormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     commissionRate: 0,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "commissionRate" ? parseFloat(value) : value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//     setFormData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       address: "",
//       commissionRate: 0,
//     });
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Add New Agent</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>First Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Last Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Phone</Form.Label>
//             <Form.Control
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Address</Form.Label>
//             <Form.Control
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Commission Rate (%)</Form.Label>
//             <Form.Control
//               type="number"
//               name="commissionRate"
//               value={formData.commissionRate}
//               onChange={handleChange}
//               min="0"
//               max="100"
//               step="0.01"
//               required
//             />
//           </Form.Group>

//           <div className="d-flex justify-content-end gap-2">
//             <Button variant="secondary" onClick={onHide}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               Add Agent
//             </Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AddAgentForm;
