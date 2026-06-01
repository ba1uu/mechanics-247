// Simple global state using localStorage
export type UserRole = "customer" | "mechanic" | "admin" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  state?: string;
}

export interface Vehicle {
  id: string;
  type: string;
  brand: string;
  model: string;
  number: string;
  fuel: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  issue: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  mechanic?: string;
  amount?: number;
  date: string;
  location: string;
}

const STORAGE_KEYS = {
  USER: "m247_user",
  VEHICLES: "m247_vehicles",
  BOOKINGS: "m247_bookings",
  MECHANICS: "m247_mechanics",
  CUSTOMERS: "m247_customers",
};

export const store = {
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const u = localStorage.getItem(STORAGE_KEYS.USER);
    return u ? JSON.parse(u) : null;
  },
  setUser: (user: User | null) => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  },
  getVehicles: (): Vehicle[] => {
    if (typeof window === "undefined") return [];
    const v = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return v ? JSON.parse(v) : [];
  },
  addVehicle: (vehicle: Vehicle) => {
    const vehicles = store.getVehicles();
    vehicles.push(vehicle);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },
  getBookings: (): Booking[] => {
    if (typeof window === "undefined") return [];
    const b = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return b ? JSON.parse(b) : sampleBookings;
  },
  addBooking: (booking: Booking) => {
    const bookings = store.getBookings();
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },
  getCustomers: () => {
    if (typeof window === "undefined") return sampleCustomers;
    const c = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return c ? JSON.parse(c) : sampleCustomers;
  },
  getMechanics: () => {
    if (typeof window === "undefined") return sampleMechanics;
    const m = localStorage.getItem(STORAGE_KEYS.MECHANICS);
    return m ? JSON.parse(m) : sampleMechanics;
  },
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

export const sampleBookings: Booking[] = [
  { id: "BK001", vehicleId: "v1", issue: "Puncture", status: "completed", mechanic: "Rajesh Kumar", amount: 350, date: "2025-05-28", location: "Nellore, AP" },
  { id: "BK002", vehicleId: "v1", issue: "Battery Dead", status: "completed", mechanic: "Suresh Babu", amount: 499, date: "2025-05-15", location: "Nellore, AP" },
  { id: "BK003", vehicleId: "v1", issue: "Engine Problem", status: "in_progress", mechanic: "Venkat Rao", amount: 799, date: "2025-05-30", location: "Nellore, AP" },
];

export const sampleMechanics = [
  { id: "M001", name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@example.com", city: "Nellore", rating: 4.9, jobs: 234, status: "approved", skills: ["Engine", "Electrical"], experience: 8 },
  { id: "M002", name: "Suresh Babu", phone: "9876543211", email: "suresh@example.com", city: "Nellore", rating: 4.7, jobs: 189, status: "approved", skills: ["Puncture", "Battery"], experience: 5 },
  { id: "M003", name: "Venkat Rao", phone: "9876543212", email: "venkat@example.com", city: "Nellore", rating: 4.8, jobs: 312, status: "pending", skills: ["Towing", "AC"], experience: 10 },
  { id: "M004", name: "Krishna Murthy", phone: "9876543213", email: "krishna@example.com", city: "Nellore", rating: 4.6, jobs: 145, status: "rejected", skills: ["EV", "Brake"], experience: 3 },
];

export const sampleCustomers = [
  { id: "C001", name: "Amit Sharma", phone: "9123456789", email: "amit@example.com", city: "Nellore", bookings: 5, joined: "2025-01-15" },
  { id: "C002", name: "Priya Reddy", phone: "9123456790", email: "priya@example.com", city: "Nellore", bookings: 3, joined: "2025-02-20" },
  { id: "C003", name: "Ravi Teja", phone: "9123456791", email: "ravi@example.com", city: "Nellore", bookings: 8, joined: "2024-12-10" },
];