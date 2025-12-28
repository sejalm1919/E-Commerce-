package com.yourapp.ecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.yourapp.ecommerce.dto.CheckoutRequestDTO;
import com.yourapp.ecommerce.dto.OrderItemRequestDTO;
import com.yourapp.ecommerce.entity.Order;
import com.yourapp.ecommerce.entity.OrderItem;
import com.yourapp.ecommerce.entity.Payment;
import com.yourapp.ecommerce.entity.Product;
import com.yourapp.ecommerce.repository.OrderRepository;
import com.yourapp.ecommerce.repository.ProductRepository;

@Service
public class OrderServiceImpl implements OrderService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public OrderServiceImpl(ProductRepository productRepository,
            OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public Order placeOrder(CheckoutRequestDTO checkoutRequest) {

        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");
        order.setShippingAddress(checkoutRequest.getShippingAddress());

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequestDTO itemDTO : checkoutRequest.getItems()) {

            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(product.getPrice());
            item.setOrder(order);

            totalAmount = totalAmount.add(
                    product.getPrice().multiply(
                            BigDecimal.valueOf(itemDTO.getQuantity())));

            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        // Simulated payment processing
        Payment payment = new Payment();
        payment.setPaymentMethod("CARD");
        payment.setPaymentStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setCardHolderName(checkoutRequest.getPayment().getCardHolderName());
        payment.setCardLast4Digits(
                checkoutRequest.getPayment().getCardNumber()
                        .substring(checkoutRequest.getPayment().getCardNumber().length() - 4));
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setOrder(order);

        order.setPayment(payment);

        return orderRepository.save(order);
    }
}
