package com.example.coral_ec.item;

import com.example.coral_ec.dto.CreateItemRequest;
import com.example.coral_ec.dto.ItemResponse;
import com.example.coral_ec.exception.ItemNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

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
    
    @Transactional(readOnly = true)
    public List<ItemResponse> getActiveItems() {
    	return itemRepository.findByStatusOrderByCreatedAtDesc("active")
    			.stream()
    			.map(this::toResponse)
    			.toList();
    }
    
    @Transactional(readOnly = true)
    public ItemResponse getItem(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException(itemId));

        return toResponse(item);
    }
    
    @Transactional(readOnly = true)
    public List<ItemResponse> searchItems(
            String keyword,
            String category,
            String condition,
            Integer minPrice,
            Integer maxPrice
    ) {
        String normalizedKeyword = nullableTrim(keyword);
        String normalizedCategory = nullableTrim(category);
        String normalizedCondition = nullableTrim(condition);

        return itemRepository.findByStatusOrderByCreatedAtDesc("active")
                .stream()
                .filter(item -> normalizedKeyword == null
                        || item.getTitle().toLowerCase().contains(normalizedKeyword.toLowerCase())
                        || item.getDescription().toLowerCase().contains(normalizedKeyword.toLowerCase()))
                .filter(item -> normalizedCategory == null
                        || normalizedCategory.equals(item.getCategory()))
                .filter(item -> normalizedCondition == null
                        || normalizedCondition.equals(item.getCondition()))
                .filter(item -> minPrice == null || item.getPrice() >= minPrice)
                .filter(item -> maxPrice == null || item.getPrice() <= maxPrice)
                .map(this::toResponse)
                .toList();
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