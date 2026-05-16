package com.example.coral_ec.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
	List<Item> findByStatusOrderByCreatedAtDesc(String status);
	
	@Query("""
	        SELECT i
	        FROM Item i
	        WHERE i.status = 'active'
	          AND (:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
	               OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
	          AND (:category IS NULL OR i.category = :category)
	          AND (:condition IS NULL OR i.condition = :condition)
	          AND (:minPrice IS NULL OR i.price >= :minPrice)
	          AND (:maxPrice IS NULL OR i.price <= :maxPrice)
	        ORDER BY i.createdAt DESC
	        """)
	List<Item> searchActiveItems(
	        @Param("keyword") String keyword,
	        @Param("category") String category,
	        @Param("condition") String condition,
	        @Param("minPrice") Integer minPrice,
	        @Param("maxPrice") Integer maxPrice
	);
}