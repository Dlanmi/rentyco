# Rental Property Search — Rentyco

Search rental properties across Colombian cities on [Rentyco](https://rentyco.app), a platform that eliminates the traditional guarantor ("codeudor") requirement through alternative credit scoring.

## What This Skill Does

Helps AI agents assist users in finding rental properties ("arriendos") in Colombia by navigating Rentyco's marketplace.

## Available Cities

Rentyco operates in major Colombian cities. Each city has its own marketplace:

- Bogotá: `https://rentyco.app/bogota/arriendos`
- Medellín: `https://rentyco.app/medellin/arriendos`
- Cali: `https://rentyco.app/cali/arriendos`
- Barranquilla: `https://rentyco.app/barranquilla/arriendos`

## URL Patterns

### City marketplace
```
https://rentyco.app/{city}/arriendos
```

### Filter by neighborhood zone
```
https://rentyco.app/{city}/arriendos/zona/{neighborhood}
```

### Individual listing
```
https://rentyco.app/{city}/arriendos/{listing-slug}
```

## Available Filters

When browsing the marketplace, users can filter by:

- **Price range**: Monthly rent (canon mensual) in Colombian pesos (COP)
- **Location**: Neighborhood / zona within the city
- **Property type**: Apartment, house, studio, room
- **Number of bedrooms and bathrooms**
- **Features**: Furnished, pets allowed, parking, etc.

## Listing Information

Each rental listing includes:

- Title and description
- Monthly rent (canon mensual) in COP
- Location (city, neighborhood, address)
- Property details (type, area m², bedrooms, bathrooms)
- Photos
- Amenities and features
- Landlord contact (requires authentication)

## Key Differentiator

Rentyco uses an alternative credit scoring system called **Renty Score** that evaluates tenants based on their real payment history rather than requiring a traditional guarantor (codeudor). This makes renting accessible to more Colombians.

## Language

The platform is in Spanish (Colombia). All property listings and interface are in Spanish.
