(module
  (import "js" "memory" (memory 1))
  (func (export "add") (param $arraySize i32)
    (local $result i32)
    (local $i i32)
    (local.set $result (i32.shl (local.get $arraySize) (i32.const 1))) ;; arraySize * 2
    (loop
      (v128.store
        (i32.add (local.get $result) (local.get $i))
        (i8x16.add
          (v128.load (local.get $i)) ;; a
          (v128.load (i32.add (local.get $arraySize) (local.get $i))) ;; b
        )
      )
      (br_if 0 (i32.lt_u
        (local.tee $i (i32.add (local.get $i) (i32.const 16)))
        (local.get $arraySize)
      ))
    )
  )
)