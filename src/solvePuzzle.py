import itertools
import random
import sys

arg_count = len(sys.argv)

target = int(sys.argv[1])
numbers = []

for i in range(2, arg_count):
    numbers += [int(sys.argv[i])]

n = len(numbers)
numbersAll = list(itertools.permutations(numbers))
random.shuffle(numbersAll)  # So it gives a random solution

operationsAll = list(itertools.product(["*", "+", "-", "/"], repeat=n-1))
operationsOrderAll = list(itertools.permutations( list(range(n))[1:] ))


def computePart(numbers,index,operation):
    match operation:
        case "+":
            numbers = numbers[:index] + [numbers[index] + numbers[index+1]] + numbers[index+2:]
        case "-":
            numbers = numbers[:index] + [numbers[index] - numbers[index+1]] + numbers[index+2:]
        case "/":
            if numbers[index+1] == 0:  #Zero Division
                return False
            if numbers[index] % numbers[index+1]:  #If the remainder is not 0
                return False
            numbers = numbers[:index] + [numbers[index] / numbers[index+1]] + numbers[index+2:]
        case "*":
            numbers = numbers[:index] + [numbers[index] * numbers[index+1]] + numbers[index+2:]
    return numbers
 
def compute(a_list):
    numbers, operations, operationsOrder = [list (i) for i in a_list]

    for i in range(4):
        index = operationsOrder.index(1)
        operation = operations[index]

        result = computePart(numbers,index,operation)
        if result == False:
            return -1
        
        numbers = result
        operationsOrder.pop(index)
        operations.pop(index)
        temp = [x-1 for x in operationsOrder]
        operationsOrder = temp

    return numbers[0]

def show_compute(a_list):
    numbers, operations, operationsOrder = [list (i) for i in a_list]
    fancy_list = [str(k) for k in numbers]

    print(a_list)

    for i in range(4):
        index = operationsOrder.index(1)
        operation = operations[index]

        process_list = numbers[:index] + ["("] + [numbers[index]] + [operation] + [numbers[index+1]] + [")"] + numbers[index+2:]
        fancy_str = " ".join(str(k) for k in process_list)
        fancy_part = " ".join(["("] + [str(numbers[index])] + [str(operation)] + [str(numbers[index+1])] + [")"])
        print(fancy_str, end="")
        fancy_list = fancy_list[:index] + [fancy_part] + fancy_list[index+2:]
        print("\t:\t" + " ".join(fancy_list))

        result = computePart(numbers,index,operation)

        if result == False:
            return -1
        
        numbers = result

        operationsOrder.pop(index)
        operations.pop(index)

        temp = [x-1 for x in operationsOrder]
        operationsOrder = temp

    return numbers[0]

solutions = []
masterList = [[i, j, k] for i in numbersAll for j in operationsAll for k in operationsOrderAll]

for i in masterList:
    if compute(i) == target:
        solutions.append(i)
        break

if solutions:
    solution = solutions[0]
    numbers, operations, operationsOrder = [list (i) for i in solution]
    fancy_list = [str(n) for n in numbers]

    for i in range(4):
        index = operationsOrder.index(1)
        operation = operations[index]

        result = computePart(numbers,index,operation)
        fancy_list[index] = f"({fancy_list[index]}{operation}{fancy_list[index+1]})"
        fancy_list.pop(index+1)
        
        
        numbers = result
        operationsOrder.pop(index)
        operations.pop(index)
        temp = [x-1 for x in operationsOrder]
        operationsOrder = temp

    print(fancy_list[0].removeprefix("(").removesuffix(")"))
    #print(numbers, operations, operationsOrder)

else:
    print("L")