import Header from "@/components/Header";
import React from "react";
import ClientTeacherProfileContent from "./ClientTeacherProfileContent";

const TeacherProfilePage = () => {
	return (
		<>
			<Header title="Profile" subtitle="View your profile" />
			<ClientTeacherProfileContent />
		</>
	);
};

export default TeacherProfilePage;
