import sys

def main():
    """Main entry point for the script."""
    print('export enum Province {')
    for line in sys.stdin:
        province = line.split(' - ')[0]
        print('\t' + province.upper().replace(' ', '_') + ' = "' + province + '",')
    print('}')


if __name__ == '__main__':
    sys.exit(main())
