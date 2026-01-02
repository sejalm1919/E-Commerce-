package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CheckoutRequestDTO;
import com.ecommerce.backend.entity.Order;

public interface OrderService {
    Order placeOrder(CheckoutRequestDTO checkoutRequest);
}
