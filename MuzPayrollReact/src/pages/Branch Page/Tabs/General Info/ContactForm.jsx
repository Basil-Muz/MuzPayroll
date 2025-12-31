export default function ContactForm({
  register,
  errors,
  disabled = false,
  requiredMap = {},
}) {
  return (
    <>
      <h3>Contact Information</h3>

      <div className="field">
        <label>Email</label>
        <input
          disabled={disabled}
          {...register("email", {
            required: requiredMap.email && "Email required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email",
            },
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div className="field">
        <label>Phone</label>
        <input
          disabled={disabled}
          {...register("phone", {
            required: requiredMap.phone && "Phone required",
          })}
        />
      </div>
    </>
  );
}
