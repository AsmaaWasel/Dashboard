import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

interface ServiceTableProps {
  services: Service[];
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service._id}>
            <TableCell>{service.name}</TableCell>
            <TableCell>{service.description}</TableCell>
            <TableCell>${service.price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServiceTable;
