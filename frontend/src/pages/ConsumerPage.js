import { useEffect, useState } from "react";
import { addConsumer } from "../services/api";

const initialForm = { name: "", email: "", phone: "" };

function ConsumerPage({ onConsumerAdded }) {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Spice Garden | Consumer Registration";
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("success");
    setIsSubmitting(true);

    try {
      await addConsumer(formData);
      setMessage("Registration successful.");
      setFormData(initialForm);
      if (onConsumerAdded) {
        await onConsumerAdded();
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="section">
      <h1>Consumer Registration</h1>
      <p className="muted-text">Phone must be a 10-digit Indian mobile number starting with 6–9.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          pattern="[6-9][0-9]{9}"
          title="10-digit Indian mobile number starting with 6-9"
          required
        />

        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      {message && (
        <p className={messageType === "success" ? "success-text" : "error-text"} role="alert" aria-live="polite">
          {message}
        </p>
      )}
    </main>
  );
}

export default ConsumerPage;
