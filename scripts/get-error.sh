#!/bin/bash
export PATH="$HOME/.local/bin:$PATH"
render logs --resources ***REMOVED*** --output json 2>&1 | grep -o '"message": "[^"]*"' | grep -i "P1001\|ENOTFOUND\|Can't reach\|FATAL" | tail -10
