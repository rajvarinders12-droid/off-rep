import React from "react";

export default function InvoiceTemplate({ order }: { order: any }) {
  const shippingAddress = order.shippingAddress;
  const totalPriceNum = Number(order.totalPrice);
  const shippingCost = totalPriceNum >= 999 ? 0 : 99;
  const subtotal = totalPriceNum - shippingCost;

  return (
    <div className="hidden print:block w-full text-black p-8 font-sans">
      <div className="flex justify-between items-start mb-8 border-b pb-8 border-black">
        <div>
          <h2 className="font-bold text-lg mb-2">Sold By :</h2>
          <p className="font-bold">OFF-REP</p>
          <p>Sector 17, Chandigarh</p>
          <p>India, 160017</p>
          <div className="mt-4">
            <p><span className="font-bold">Order Number:</span> {order.id}</p>
            <p><span className="font-bold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
          </div>
        </div>
        <div className="text-right max-w-sm">
          <h2 className="font-bold text-lg mb-2">Billing & Shipping Address :</h2>
          {shippingAddress ? (
            <>
              <p className="font-bold">{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
              <p>IN</p>
              {shippingAddress.phone && <p className="mt-2">Phone: {shippingAddress.phone}</p>}
            </>
          ) : (
            <p>No shipping address provided.</p>
          )}
        </div>
      </div>

      <table className="w-full text-left border-collapse mt-8">
        <thead>
          <tr className="border-b border-black">
            <th className="py-2 font-bold">Sl. No</th>
            <th className="py-2 font-bold">Description</th>
            <th className="py-2 text-right font-bold">Unit Price</th>
            <th className="py-2 text-right font-bold">Qty</th>
            <th className="py-2 text-right font-bold">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item: any, index: number) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-4 align-top">{index + 1}</td>
              <td className="py-4 align-top">
                <p className="font-bold">{item.product?.name || "Deleted Product"}</p>
                {item.variantColor && <p className="text-sm text-gray-600">Color: {item.variantColor.name}</p>}
                {item.variantSize && <p className="text-sm text-gray-600">Size: {item.variantSize}</p>}
              </td>
              <td className="py-4 text-right align-top">₹{Number(item.price).toLocaleString("en-IN")}</td>
              <td className="py-4 text-right align-top">{item.quantity}</td>
              <td className="py-4 text-right align-top">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
          </div>
          <div className="flex justify-between border-t border-black pt-2 font-bold text-lg">
            <span>Grand Total:</span>
            <span>₹{totalPriceNum.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This is a computer generated invoice. No signature is required.</p>
        <p>Thank you for shopping with OFF-REP!</p>
      </div>
    </div>
  );
}
