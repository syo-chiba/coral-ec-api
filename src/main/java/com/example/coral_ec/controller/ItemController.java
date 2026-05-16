package com.example.coral_ec.controller;

import com.example.coral_ec.dto.CreateItemRequest;
import com.example.coral_ec.dto.ItemResponse;
import com.example.coral_ec.item.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse create(@Valid @RequestBody CreateItemRequest request) {
        // Step E-1: 認証連携前なので固定sellerId
        return itemService.createItem(1L, request);
    }
    
    @GetMapping
    public List<ItemResponse> list() {
    	return itemService.getActiveItems();
    }
}