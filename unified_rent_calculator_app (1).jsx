import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function formatCurrency(value) {
  return `₦${value.toLocaleString()}`;
}

export default function RentCalculator() {
  const [salary, setSalary] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const interestRates = {
    6: 0.24,
    9: 0.36,
    12: 0.48
  };

  const maxLoan = salary ? salary * 2.5 : 0;
  const isEligible = requestedAmount <= maxLoan;

  const handleSubmit = () => {
    if (!salary || !requestedAmount || !renewalDate || !repaymentPeriod || !email) {
      setError("Please fill in all fields correctly.");
      return;
    }

    const interest = interestRates[repaymentPeriod];
    const totalRepayment = requestedAmount * (1 + interest);
    const monthlyRepayment = totalRepayment / repaymentPeriod;

    if (monthlyRepayment > salary * 0.3333) {
      setResult({
        limited: true
      });
      return;
    }

    setResult({
      requestedAmount,
      monthlyRepayment,
      securityDeposit: monthlyRepayment,
      repaymentPeriod
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-bold">Rent Calculator</h2>

          <div className="space-y-2">
            <Label>Monthly Salary (₦)</Label>
            <Input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} />
            {salary && <p className="text-sm">You can request up to {formatCurrency(salary * 2.5)}</p>}
          </div>

          <div className="space-y-2">
            <Label>Requested Financing Amount (₦)</Label>
            <Input type="number" value={requestedAmount} onChange={(e) => setRequestedAmount(Number(e.target.value))} />
          </div>

          <div className="space-y-2">
            <Label>Renewal Date</Label>
            <Input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Repayment Period</Label>
            <Select onValueChange={(value) => setRepaymentPeriod(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="9">9 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button className="w-full" onClick={handleSubmit}>
            Calculate
          </Button>

          {result && !result.limited && (
            <div className="mt-6 space-y-2 bg-gray-50 p-4 rounded">
              <p><strong>Requested Amount:</strong> {formatCurrency(result.requestedAmount)}</p>
              <p><strong>Monthly Repayment:</strong> {formatCurrency(result.monthlyRepayment)}/month</p>
              <p><strong>Security Deposit:</strong> {formatCurrency(result.securityDeposit)} <span title="This is refundable and equivalent to one month of your rent.">🛈</span></p>
              <Button className="w-full mt-2">Sign up and access financing now</Button>
            </div>
          )}

          {result?.limited && (
            <div className="mt-6 p-4 bg-yellow-100 rounded">
              <p className="text-yellow-800">Please note, your loan amount is limited to ensure monthly payments do not exceed 33.33% of your salary.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
