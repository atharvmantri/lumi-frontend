import os
import subprocess
import sys

def main():
    try:
        # Execute the one-line powershell installer directly!
        cmd = 'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "irm https://www.lumiassist.xyz/install.ps1 | iex"'
        subprocess.call(cmd, shell=True)
    except Exception as e:
        import ctypes
        ctypes.windll.user32.MessageBoxW(0, f"Error launching setup: {e}", "Lumi Setup Error", 0)

if __name__ == "__main__":
    main()
