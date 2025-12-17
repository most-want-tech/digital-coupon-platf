#!/bin/bash

# Test script for persistence API endpoints
# Usage: ./scripts/test-persistence.sh

BASE_URL="http://localhost:3000"

echo "🧪 Testing Persistence API Endpoints"
echo "====================================="
echo ""

# Test Personalizations API
echo "📝 Testing Personalizations API..."
echo ""

echo "1. GET /api/personalizations (initial state)"
curl -s "$BASE_URL/api/personalizations" | jq '.'
echo ""

echo "2. POST /api/personalizations (save data)"
curl -s -X POST "$BASE_URL/api/personalizations" \
  -H "Content-Type: application/json" \
  -d '{
    "customizations": {
      "hero-title": {
        "text": "Welcome to Our Amazing Store!",
        "fontSize": "3rem",
        "color": "#3b82f6"
      },
      "hero-subtitle": {
        "text": "Discover exclusive deals and offers"
      }
    }
  }' | jq '.'
echo ""

echo "3. GET /api/personalizations (verify saved data)"
curl -s "$BASE_URL/api/personalizations" | jq '.'
echo ""

# Test Brand Configs API
echo "🎨 Testing Brand Configs API..."
echo ""

echo "1. GET /api/brand-configs (initial state)"
curl -s "$BASE_URL/api/brand-configs" | jq '.'
echo ""

echo "2. POST /api/brand-configs (save data)"
curl -s -X POST "$BASE_URL/api/brand-configs" \
  -H "Content-Type: application/json" \
  -d '{
    "configs": {
      "business-123": {
        "platformName": "SuperStore Coupons",
        "primaryColor": "#3b82f6",
        "accentColor": "#8b5cf6",
        "tagline": "Your savings destination",
        "backgroundColor": "#ffffff"
      },
      "business-456": {
        "platformName": "Fashion Hub",
        "primaryColor": "#ec4899",
        "accentColor": "#f97316",
        "tagline": "Style meets savings"
      }
    }
  }' | jq '.'
echo ""

echo "3. GET /api/brand-configs (verify saved data)"
curl -s "$BASE_URL/api/brand-configs" | jq '.'
echo ""

# Test Delete Operations
echo "🗑️  Testing Delete Operations..."
echo ""

echo "1. DELETE /api/personalizations"
curl -s -X DELETE "$BASE_URL/api/personalizations" | jq '.'
echo ""

echo "2. DELETE /api/brand-configs"
curl -s -X DELETE "$BASE_URL/api/brand-configs" | jq '.'
echo ""

echo "3. Verify reset"
echo "Personalizations:"
curl -s "$BASE_URL/api/personalizations" | jq '.customizations'
echo ""
echo "Brand Configs:"
curl -s "$BASE_URL/api/brand-configs" | jq '.configs'
echo ""

echo "✅ All tests completed!"
echo ""
echo "💡 Check the data/ directory to see the JSON files:"
echo "   ls -la data/"
echo "   cat data/personalizations.json | jq '.'"
echo "   cat data/brand-configs.json | jq '.'"
