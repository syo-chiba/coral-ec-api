package com.example.coral_ec.customer;

import com.example.coral_ec.dto.CustomerResponse;
import com.example.coral_ec.dto.CustomerResponse.LineStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private static final List<CustomerResponse> CUSTOMERS = List.of(
            new CustomerResponse(
                    "C001",
                    "山田太郎",
                    "CT-1001",
                    "090-1111-2222",
                    "法人ギガライト",
                    LineStatus.ACTIVE,
                    BigDecimal.valueOf(12800),
                    LocalDate.of(2026, 6, 10)
            ),
            new CustomerResponse(
                    "C002",
                    "佐藤花子",
                    "CT-1002",
                    "080-3333-4444",
                    "IoT回線プラン",
                    LineStatus.SUSPENDED,
                    BigDecimal.valueOf(5400),
                    LocalDate.of(2026, 6, 8)
            ),
            new CustomerResponse(
                    "C003",
                    "鈴木通信株式会社",
                    "CT-1003",
                    "070-5555-6666",
                    "閉域網スタンダード",
                    LineStatus.CANCELLED,
                    BigDecimal.valueOf(0),
                    LocalDate.of(2026, 5, 31)
            )
    );

    @GetMapping
    public List<CustomerResponse> searchCustomers(@RequestParam(required = false) String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return CUSTOMERS;
        }

        String normalizedKeyword = keyword.toLowerCase(Locale.ROOT).trim();
        return CUSTOMERS.stream()
                .filter(customer -> contains(customer.customerId(), normalizedKeyword)
                        || contains(customer.customerName(), normalizedKeyword)
                        || contains(customer.contractNo(), normalizedKeyword)
                        || contains(customer.phoneNumber(), normalizedKeyword)
                        || contains(customer.planName(), normalizedKeyword))
                .toList();
    }

    private static boolean contains(String value, String keyword) {
        return value.toLowerCase(Locale.ROOT).contains(keyword);
    }
}
