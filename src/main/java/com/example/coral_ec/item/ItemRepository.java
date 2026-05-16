package com.example.coral_ec.item;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByStatusOrderByCreatedAtDesc(String status);
}