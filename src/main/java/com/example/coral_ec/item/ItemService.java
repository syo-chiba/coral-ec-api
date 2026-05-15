package com.example.coral_ec.item;

import com.example.coral_ec.dto.CreateItemRequest;
import com.example.coral_ec.dto.ItemResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Transactional
    public ItemResponse createItem(Long sellerId, CreateItemRequest request) {
        Item item = new Item();
        item.setSellerId(sellerId);
        item.setTitle(request.title().trim());
        item.setDescription(request.description().trim());
        item.setPrice(request.price());
        item.setCategory(nullableTrim(request.category()));
        item.setCondition(request.condition());
        item.setStatus("active");

        Item saved = itemRepository.save(item);
        return toResponse(saved);
    }

    private ItemResponse toResponse(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getSellerId(),
                item.getTitle(),
                item.getDescription(),
                item.getPrice(),
                item.getCategory(),
                item.getCondition(),
                item.getStatus(),
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }

    private String nullableTrim(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}