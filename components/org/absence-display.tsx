"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AbsenceDisplayProps {
  total: { justified: number; nonJustified: number };
  elements: Record<string, { justified: number; nonJustified: number }>;
}

export function AbsenceDisplay({ total, elements }: AbsenceDisplayProps) {
  const totalNonJustified = total.nonJustified;
  const totalJustified = total.justified;
  const totalAbsences = totalNonJustified + totalJustified;

  const elementEntries = Object.entries(elements);

  return (
    <div className="space-y-6">
      {/* Totals Row */}
      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {totalNonJustified}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Non-Justified
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalJustified}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Justified
            </div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {totalAbsences}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Absences
            </div>
          </div>
        </div>
      </div>
      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Absence Summary by Course</CardTitle>
          <CardDescription>
            Overview of justified and non-justified absences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead className="text-right">Non-Justified</TableHead>
                  <TableHead className="text-right">Justified</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elementEntries.map(([code, data], index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{code}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{data.nonJustified}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{data.justified}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {data.nonJustified + data.justified}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Section */}
    </div>
  );
}
