@builtin "number.ne" # includes number parsing logic from the builtin number grammar

# Main entry point for a formula
formula -> function_call {% id %} | reference {% id %}

# Function call like AVG(A1:A3)
function_call -> "=" function_name "(" range ")" {% (d) => [d[1], d[3]] %}
function_name -> "AVG" | "SUM" {% id %} # Extend with other function names as needed

# Range like A1:A3
range -> cell ":" cell {% (d) => [d[0], d[2]] %}


cell -> column row {% (d) => [d[0], d[1]] %}

# Cell reference like A1
reference -> "=" "REF" "(" column row ")" {% (d) => [d[3], d[4]] %}

column -> letter:+ {% (d) => d[0].join('') %}

row -> [0-9]:+ {% (d) => parseInt(d[0].join(''), 10) %}

# Helper to match letters (for column references)
letter -> [A-Z] {% id %}
