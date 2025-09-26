export function toUserDTO(user) {
  if (!user) return null;
  return {
    id: user._id?.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    role: user.role,
    cart: user.cart ? user.cart.toString() : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
