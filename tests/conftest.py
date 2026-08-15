"""Shared test config: prefer mock-only runs so tests need no API keys."""

import os

# Ensure no real provider keys leak into tests.
for k in list(os.environ):
    if k.endswith("API_KEY") or k.endswith("_HOST"):
        # leave them, but tests use explicit mock config anyway
        pass
