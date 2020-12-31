(module
  (memory (import "js" "memory") 1)
  (func (export "add") (param i32)
    local.get 0
    i32.const 2
    i32.mul
    i32.const 0
    v128.load
    local.get 0
    v128.load
    i8x16.add
    v128.store
  )
)