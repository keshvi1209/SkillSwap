import styles from "./SuccessAlert.module.css";

export default function SuccessAlert({ onClose }) {
  return (
    <div className={styles.snackbar}>
      <div className="text-[#2b9875] bg-white/5 backdrop-blur-xl p-1 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </div>
      <div>
        <p>Submitted successfully :)</p>
      </div>
    </div>
  );
}
