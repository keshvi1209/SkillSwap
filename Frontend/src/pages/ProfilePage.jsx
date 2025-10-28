import { useState } from "react";
import Basicdetails from "../components/Basicdetails";
import SkillsSummary from "../components/SkillsSummary.jsx";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  return (
    <div className={styles.parent}>
      <header className={styles.header}>
        <h1 className={styles.title}>Profile Details</h1>
      </header>

      <div>
        <div className="flex flex-col lg:flex-row gap-4 min-w-screen px-8 mx-4">
          <div className="w-full lg:w-1/3">
            <Basicdetails />

            <div className="mt-4 p-4 rounded-2xl shadow bg-white">
              <h3 className="text-lg font-semibold mb-2">Ratings</h3>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-gray-300 text-xl">⭐</span>
                <span className="ml-2 text-sm text-gray-600">4.0 / 5</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <SkillsSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
