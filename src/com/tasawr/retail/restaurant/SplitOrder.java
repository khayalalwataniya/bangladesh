package com.tasawr.retail.restaurant;

import java.math.BigDecimal;

import org.codehaus.jettison.json.JSONObject;
import org.openbravo.model.common.invoice.Invoice;
import org.openbravo.model.common.order.Order;
import org.openbravo.retail.posterminal.PaymentProcessor;

public class SplitOrder implements PaymentProcessor {
 
  public void process(JSONObject payment, Order order, Invoice invoice, BigDecimal writeoff) {
    // Do nothing
  }
  
}