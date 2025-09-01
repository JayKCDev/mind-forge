import Header from "@/components/Header";
import React from "react";
import ClientProfileContent from "./ClientProfileContent";

const UserProfilePage = () => {
	return (
		<>
			<Header title="Profile" subtitle="View your profile" />
			<ClientProfileContent />
		</>
	);
};

export default UserProfilePage;
