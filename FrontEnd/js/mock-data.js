export const REVIEW = "Room awaiting review";

export const STATUS_LABELS = {
  red: "Needs cleaning",
  yel: "In progress",
  grn: "Complete",
};

export const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export const CATEGORIES = [
  "Appliance",
  "Plumbing",
  "Electrical",
  "Furniture",
  "Other",
];

export const SKIP_REASONS = [
  "Guest requested privacy",
  "Do not disturb sign",
  "Return later",
];

export const WO_STATUSES = ["Open", "In Progress", "Complete", "Cancelled"];

export const WO_PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
      '<rect fill="#c8d0da" width="400" height="300"/>' +
      '<text x="200" y="155" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#333">No photo</text>' +
      "</svg>"
  );

export function getInitialRooms() {
  return [
    {
      id: 1,
      number: 101,
      status: "red",
      comments: ["Replace sheets", "Fridge needs to be cleaned"],
      displayComment: "Fridge needs to be cleaned",
    },
    {
      id: 2,
      number: 102,
      status: "yel",
      comments: [],
      displayComment: "N/A",
    },
    {
      id: 3,
      number: 103,
      status: "yel",
      comments: ["Vacuum floor"],
      displayComment: "Vacuum floor",
    },
    {
      id: 4,
      number: 104,
      status: "grn",
      comments: [],
      displayComment: "",
    },
  ];
}

function daysAgo(days, hours, minutes) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export function getSeedWorkOrders() {
  return [
    {
      id: "wo-1",
      roomNumber: 101,
      createdAt: daysAgo(2, 11, 11),
      requester: "Barry B. Benson",
      priority: "High",
      category: "Plumbing",
      description: "Sink broken",
      status: "In Progress",
      imageUrl: WO_PLACEHOLDER_IMAGE,
    },
    {
      id: "wo-2",
      roomNumber: 205,
      createdAt: daysAgo(1, 9, 30),
      requester: "Jamie Lee",
      priority: "Medium",
      category: "Electrical",
      description: "Outlet not working near desk",
      status: "Open",
      imageUrl: WO_PLACEHOLDER_IMAGE,
    },
    {
      id: "wo-3",
      roomNumber: 118,
      createdAt: daysAgo(1, 14, 5),
      requester: "Sam Ortiz",
      priority: "Low",
      category: "Furniture",
      description: "Chair wheel loose",
      status: "Open",
      imageUrl: WO_PLACEHOLDER_IMAGE,
    },
    {
      id: "wo-4",
      roomNumber: 302,
      createdAt: daysAgo(0, 8, 15),
      requester: "Pat Chen",
      priority: "Urgent",
      category: "Appliance",
      description: "Mini-fridge not cooling",
      status: "In Progress",
      imageUrl: WO_PLACEHOLDER_IMAGE,
    },
    {
      id: "wo-5",
      roomNumber: 104,
      createdAt: daysAgo(3, 16, 45),
      requester: "Housekeeping",
      priority: "Medium",
      category: "Plumbing",
      description: "Slow drain in tub",
      status: "Open",
      imageUrl: WO_PLACEHOLDER_IMAGE,
    },
  ];
}

export function formatWorkOrderDate(iso) {
  const d = new Date(iso);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  const min = String(m).padStart(2, "0");
  return `${months[d.getMonth()]} ${d.getDate()} - ${hour12}:${min}${ampm}`;
}
