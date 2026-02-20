# TODO: Optimize /api/orders endpoint with JOIN

## Task
Optimize the `/api/orders` endpoint to use SQL JOIN instead of N+1 queries for better performance.

## Steps:
- [x] 1. Optimize `/api/orders` endpoint in server.js using SQL JOIN
- [ ] 2. Test the endpoint works correctly

## Changes:
- Replace N+1 query pattern with a single JOIN query
- Return orders with their items in one efficient query

