import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import React from "react";
import ClientTeacherBillingContent from "./ClientTeacherBillingContent";

const TeacherBilling = () => {
	return (
		<div className="billing">
			<Header title="Billing" subtitle="View your billing information" />
			<ClientTeacherBillingContent />
		</div>
	);
};

export default TeacherBilling;
