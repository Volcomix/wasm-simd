(module
  (import "js" "memory" (memory 1))
  ;; For now, only adds 3 on each value of "a"
  (func (export "add") (param $arraySize i32) (result i32)
    (local $result i32)
    (local $i i32)
    (v128.store
      (local.tee $result (i32.mul (local.get $arraySize) (i32.const 2)))
      (v128.load (i32.const 0))
    )
    (loop
      (v128.store
        (local.get $result)
        (i8x16.add (v128.load (local.get $result)) (i8x16.splat (i32.const 1)))
      )
      (br_if 0 (i32.ne
        (local.tee $i (i32.add (local.get $i) (i32.const 1)))
        (i32.const 3)
      ))
    )
    local.get $i
  )
)