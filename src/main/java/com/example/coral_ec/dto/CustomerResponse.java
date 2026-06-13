package com.example.coral_ec.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CustomerResponse(
        String customerId,
        String customerName,
        String contractNo,
        String phoneNumber,
        String planName,
        LineStatus lineStatus,
        BigDecimal billingAmount,
        LocalDate lastCommunicationDate
) {
    public enum LineStatus {
        ACTIVE,
        SUSPENDED,
        CANCELLED
    }
}
