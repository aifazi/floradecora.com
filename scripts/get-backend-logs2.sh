#!/bin/bash
export PATH="$HOME/.local/bin:$PATH"
render logs --resources ***REMOVED*** --output json 2>&1 | tail -c 8000 | grep -o '"message": "[^"]*"' | tail -40
