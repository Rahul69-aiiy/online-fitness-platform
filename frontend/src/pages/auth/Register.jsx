import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StudentRegister from "@/components/auth/StudentRegister.jsx";
import TrainerRegister from "@/components/auth/TrainerRegister.jsx";

export default function Register() {
  
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("role");
  const [role, setRole] = useState(query || "student");

  useEffect(()=> {
    setSearchParams({role})
  }, [role, setSearchParams])

  if (role === "trainer") {
    return <TrainerRegister role={role} setRole={setRole} />;
  }

  return <StudentRegister role={role} setRole={setRole} />;
}
