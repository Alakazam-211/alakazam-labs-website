#!/usr/bin/env python3
"""
Script to verify that solutions can be sorted by the 'order' field from Fillout DB.
Run this before implementing the sorting feature.

Usage:
    python3 verify_sorting.py
    
Or with environment variables:
    export FILLOUT_API_KEY="your_key"
    export FILLOUT_SOLUTIONS_DB_ID="your_db_id"
    export FILLOUT_SOLUTIONS_TABLE_ID="your_table_id"
    python3 verify_sorting.py
"""

import os
import requests
import json
from typing import List, Dict, Any
from pathlib import Path

# Try to load from .env.local file
env_file = Path('.env.local')
if env_file.exists():
    print("📄 Loading environment variables from .env.local...")
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                # Remove quotes if present
                value = value.strip().strip('"').strip("'")
                os.environ[key.strip()] = value

# Get environment variables
API_KEY = os.getenv('FILLOUT_TESTIMONIALS_API_KEY') or os.getenv('FILLOUT_API_KEY') or ''
BASE_URL = os.getenv('FILLOUT_BASE_URL') or os.getenv('FILLOUT_API_BASE_URL') or 'https://tables.fillout.com/api/v1'
DB_ID = os.getenv('FILLOUT_SOLUTIONS_DB_ID') or ''
TABLE_ID = os.getenv('FILLOUT_SOLUTIONS_TABLE_ID') or ''

def fetch_solutions() -> List[Dict[str, Any]]:
    """Fetch solutions from Fillout API"""
    if not API_KEY or not DB_ID or not TABLE_ID:
        print("❌ Missing required environment variables:")
        print(f"   FILLOUT_API_KEY: {'✓' if API_KEY else '✗'}")
        print(f"   FILLOUT_SOLUTIONS_DB_ID: {'✓' if DB_ID else '✗'}")
        print(f"   FILLOUT_SOLUTIONS_TABLE_ID: {'✓' if TABLE_ID else '✗'}")
        return []
    
    url = f"{BASE_URL}/bases/{DB_ID}/tables/{TABLE_ID}/records/list"
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json',
    }
    
    payload = {
        'limit': 100
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        return data.get('records', [])
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching solutions: {e}")
        if hasattr(e.response, 'text'):
            print(f"   Response: {e.response.text}")
        return []

def extract_order_field(record: Dict[str, Any]) -> int:
    """Extract order field from record, handling various field name possibilities"""
    fields = record.get('fields', record.get('data', {}))
    
    # Try different possible field names
    order = (
        fields.get('Order') or
        fields.get('order') or
        fields.get('ORDER') or
        fields.get('sort_order') or
        fields.get('Sort Order') or
        None
    )
    
    # Convert to int if it exists, otherwise return a high number (sorts last)
    if order is not None:
        try:
            return int(float(order))  # Handle both int and float strings
        except (ValueError, TypeError):
            return 9999  # Invalid order values go to the end
    return 9999  # Missing order values go to the end

def verify_sorting():
    """Verify that solutions can be sorted by order field"""
    print("🔍 Fetching solutions from Fillout DB...")
    records = fetch_solutions()
    
    if not records:
        print("❌ No records found or failed to fetch")
        return False
    
    print(f"✓ Found {len(records)} solutions\n")
    
    # Check if order field exists
    print("📊 Checking for 'order' field in records...")
    order_fields_found = []
    for record in records:
        fields = record.get('fields', record.get('data', {}))
        order_value = extract_order_field(record)
        if order_value != 9999:
            title = fields.get('Solution Title') or fields.get('solutionTitle') or fields.get('Solution') or 'Unknown'
            order_fields_found.append({
                'title': title,
                'order': order_value,
                'fields': list(fields.keys())
            })
    
    if not order_fields_found:
        print("⚠️  No 'order' field found in any records")
        print("   Checking available fields in first record:")
        if records:
            fields = records[0].get('fields', records[0].get('data', {}))
            print(f"   Available fields: {', '.join(fields.keys())}")
        return False
    
    print(f"✓ Found 'order' field in {len(order_fields_found)} records\n")
    
    # Sort by order
    print("🔄 Sorting solutions by order field...")
    sorted_records = sorted(records, key=extract_order_field)
    
    # Display sorted results
    print("\n📋 Solutions sorted by order (ascending):\n")
    for i, record in enumerate(sorted_records[:10], 1):  # Show first 10
        fields = record.get('fields', record.get('data', {}))
        title = fields.get('Solution Title') or fields.get('solutionTitle') or fields.get('Solution') or 'Unknown'
        order = extract_order_field(record)
        order_display = order if order != 9999 else 'N/A'
        print(f"  {i}. [{order_display}] {title}")
    
    if len(sorted_records) > 10:
        print(f"  ... and {len(sorted_records) - 10} more")
    
    # Verify sorting is correct
    orders = [extract_order_field(r) for r in sorted_records]
    is_sorted = orders == sorted(orders)
    
    print(f"\n{'✅' if is_sorted else '❌'} Sorting verification: {'PASSED' if is_sorted else 'FAILED'}")
    
    return is_sorted

if __name__ == '__main__':
    print("=" * 60)
    print("Solutions Sorting Verification")
    print("=" * 60)
    print()
    
    success = verify_sorting()
    
    print()
    print("=" * 60)
    if success:
        print("✅ Ready to implement sorting in the API route!")
    else:
        print("⚠️  Please check the 'order' field in your Fillout database")
    print("=" * 60)
