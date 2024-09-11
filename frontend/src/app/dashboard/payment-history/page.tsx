"use client";
import React, { useEffect } from 'react';
import PaymentHistoryTable from '@/components/modules/paymentHistory/PaymentHistoryTable';
import { useTransactionStore } from '@/stores/transactionStore';

export default function PaymentHistoryPage() {
  const { fetchTransactions } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div>
      <PaymentHistoryTable />
    </div>
  );
}