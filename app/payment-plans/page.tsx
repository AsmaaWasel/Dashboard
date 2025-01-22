"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Types
interface PaymentPlan {
  id: number;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
}

// Mock API functions
const mockApi = {
  getPaymentPlans: (): Promise<PaymentPlan[]> => {
    return Promise.resolve([
      { id: 1, name: "Basic", price: 9.99, billingCycle: "monthly" },
      { id: 2, name: "Pro", price: 19.99, billingCycle: "monthly" },
      { id: 3, name: "Enterprise", price: 199.99, billingCycle: "yearly" },
    ]);
  },
  createPaymentPlan: (plan: Omit<PaymentPlan, "id">): Promise<PaymentPlan> => {
    return Promise.resolve({ ...plan, id: Date.now() });
  },
  updatePaymentPlan: (plan: PaymentPlan): Promise<PaymentPlan> => {
    return Promise.resolve(plan);
  },
  deletePaymentPlan: (id: number): Promise<void> => {
    return Promise.resolve();
  },
};

export default function PaymentPlansPage() {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PaymentPlan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch plans on component mount
  useState(() => {
    mockApi.getPaymentPlans().then((fetchedPlans) => {
      setPlans(fetchedPlans);
      setIsLoading(false);
    });
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const planData = {
      name: formData.get("name") as string,
      price: Number.parseFloat(formData.get("price") as string),
      billingCycle: formData.get("billingCycle") as "monthly" | "yearly",
    };

    if (currentPlan) {
      // Update existing plan
      const updatedPlan = await mockApi.updatePaymentPlan({
        ...planData,
        id: currentPlan.id,
      });
      setPlans(plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
      toast({ title: "Plan updated successfully" });
    } else {
      // Create new plan
      const newPlan = await mockApi.createPaymentPlan(planData);
      setPlans([...plans, newPlan]);
      toast({ title: "New plan created successfully" });
    }

    setIsFormOpen(false);
    setCurrentPlan(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await mockApi.deletePaymentPlan(deleteId);
      setPlans(plans.filter((p) => p.id !== deleteId));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      toast({ title: "Plan deleted successfully" });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Payment Plans</h1>
      <Button onClick={() => setIsFormOpen(true)} className="mb-5">
        <Plus className="mr-2 h-4 w-4" /> Add New Plan
      </Button>

      {isLoading ? (
        <p>Loading plans...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>${plan.price.toFixed(2)}</TableCell>
                <TableCell>{plan.billingCycle}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentPlan(plan);
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeleteId(plan.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentPlan ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentPlan?.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={currentPlan?.price}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billingCycle" className="text-right">
                  Billing Cycle
                </Label>
                <select
                  id="billingCycle"
                  name="billingCycle"
                  defaultValue={currentPlan?.billingCycle}
                  className="col-span-3"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentPlan ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment plan? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
