package com.yourapp.ecommerce.service;

import com.yourapp.ecommerce.dto.CheckoutRequestDTO;
import com.yourapp.ecommerce.entity.Order;

public interface OrderService {
    Order placeOrder(CheckoutRequestDTO checkoutRequest);
}
