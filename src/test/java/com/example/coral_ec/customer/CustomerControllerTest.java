package com.example.coral_ec.customer;
import com.example.coral_ec.exception.ApiExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CustomerController.class)
@Import(ApiExceptionHandler.class)
public class CustomerControllerTest {
	
	@Autowired
	private MockMvc mockMvc;
	
    @Test
    void getCustomer_existingCustomer_returnsCustomerDetail() throws Exception {
        mockMvc.perform(get("/api/customers/{customerId}", "C001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerId").value("C001"))
                .andExpect(jsonPath("$.customerName").value("山田太郎"))
                .andExpect(jsonPath("$.contractNo").value("CT-1001"))
                .andExpect(jsonPath("$.phoneNumber").value("090-1111-2222"))
                .andExpect(jsonPath("$.planName").value("法人ギガライト"))
                .andExpect(jsonPath("$.lineStatus").value("ACTIVE"))
                .andExpect(jsonPath("$.billingAmount").value(12800))
                .andExpect(jsonPath("$.lastCommunicationDate").value("2026-06-10"));
    }

    @Test
    void getCustomer_unknownCustomer_returnsNotFound() throws Exception {
        mockMvc.perform(get("/api/customers/{customerId}", "UNKNOWN"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Customer not found: UNKNOWN"));
    }
}
