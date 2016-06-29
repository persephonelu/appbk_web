'use strict';

describe('ngStorage', function() {
    var expect = chai.expect;

    var clearStorage = function($storage) {
        delete $storage.$reset;
        delete $storage.$default;
        delete $storage.$save;
        delete $storage.$supported;
    };

    describeStorageBehaviorFor('localStorage');
    describeStorageBehaviorFor('sessionStorage');

    function describeStorageBehaviorFor(storageType) {

        var $window, $rootScope, $storage, $timeout, $storageProvider;

        function initStorage(initialValues, init) {

            $window = {
                eventHandlers: {},
                addEventListener: function(event, handler) {
                    this.eventHandlers[event] = handler;
                }
            };

            $window[storageType] = {
                length: Object.keys(initialValues).length,
                data: initialValues,
                getItem: function(key) { return this.data[key]; },
                setItem: function(key, value) {
                    this.data[key] = value;
                    this.length = Object.keys(this.data).length;
                },
                removeItem: function(key) {
                    delete this.data[key];
                    this.length = Object.keys(this.data).length;
                },
                key: function(i) { return Object.keys(this.data)[i]; }
            };

            init && init($window[storageType]);

            module(function($provide) {
                $provide.value('$window', $window);
            });

            inject(['$rootScope', '$' + storageType, '$timeout',
                function(_$rootScope_, _$storage_, _$timeout_) {
                    $rootScope = _$rootScope_;
                    $storage = _$storage_;
                    $timeout = _$timeout_;
                }
            ]);

            return $window[storageType];
        }

        describe('$' + storageType, function() {

            describe("default-namespace", function() {

                beforeEach(module('ngStorage'));

                it('should contain a ' + storageType + ' service', function() {
                    expect(storageType).not.to.equal(null);
                });

                it('should, upon loading, contain a value for each ngStorage- key in window.' +
                    storageType, function() {

                    initStorage({
                        nonNgStorage: 'this should be ingored',
                        'ngStorage-string': '"a string"',
                        'ngStorage-number': '123',
                        'ngStorage-bool': 'true',
                        'ngStorage-object': '{"string":"a string", "number": 123, "bool": true}'
                    });

                    clearStorage($storage);

                    expect($storage).to.deep.equal({
                        string: 'a string',
                        number: 123,
                        bool: true,
                        object: { string:'a string', number: 123, bool: true }
                    });

                });

                it('should add a key to window.' + storageType + ' when a key is added to $storage',
                    function() {

                    initStorage({});
                    $storage.newKey = 'some value';
                    $rootScope.$digest();
                    $timeout.flush();
                    expect($window[storageType].data)
                        .to.deep.equal({'ngStorage-newKey': '"some value"'});
                });

                it('should update the associated key in window.' + storageType + ' when a key in $' +
                    storageType + ' is updated', function() {

                    initStorage({'ngStorage-existing': '"update me"'});
                    $storage.existing = 'updated';
                    $rootScope.$digest();

                    $timeout.flush();
                    expect($window[storageType].data)
                        .to.deep.equal({'ngStorage-existing': '"updated"'});
                });

                it('should update the associated key in window.' + storageType + ' when a key in $' +
                    storageType + ' is updated instantanious when $save is called', function() {

                    initStorage({'ngStorage-existing': '"update me"'});
                    $storage.existing = 'updated';
                    $rootScope.$digest();

                    expect($window[storageType].data)
                        .to.deep.equal({'ngStorage-existing': '"update me"'});

                    $storage.$save();

                    expect($window[storageType].data)
                        .to.deep.equal({'ngStorage-existing': '"updated"'});
                });

                it('should delete the associated key from window.' + storageType + ' when a key in $' +
                    storageType + ' is deleted', function() {

                    initStorage({'ngStorage-existing': '"delete me"'});
                    delete $storage.existing;
                    $rootScope.$digest();
                    $timeout.flush();
                    expect($window[storageType].data).to.deep.equal({});

                });

                describe('when $reset is called with no arguments', function() {

                    beforeEach(function() {

                        initStorage({
                            nonNgStorage: 'this should not be changed',
                            'ngStorage-delete': '"this should be deleted"'
                        });

                        $storage.$reset();
                        $rootScope.$digest();
                        $timeout.flush();
                    });

                    it('should delete all ngStorage- keys from window.' + storageType, function() {

                        expect($window[storageType].data).to.deep.equal({
                            nonNgStorage: 'this should not be changed'
                        });

                    });

                    it('should delete all keys from $' + storageType, function() {

                        clearStorage($storage);

                        expect($storage).to.deep.equal({});

                    });

                });

                describe('when $reset is called with an object', function() {

                    beforeEach(function() {

                        initStorage({
                            nonNgStorage: 'this should not be changed',
                            'ngStorage-delete': '"this should be deleted"'
                        });

                        $storage.$reset({some: 'value'});
                        $rootScope.$digest();
                        $timeout.flush();
                    });

                    it('should reset the ngStorage- keys on window.' + storageType +
                        ' to match the object', function() {

                        expect($window[storageType].data).to.deep.equal({
                            nonNgStorage: 'this should not be changed',
                            'ngStorage-some': '"value"'
                        });

                    });

                    it('should reset $' + storageType + ' to match the object', function() {

                        clearStorage($storage);

                        expect($storage).to.deep.equal({some: 'value'});

                    });

                });

                describe('when $default is called', function() {

                    beforeEach(function() {

                        initStorage({
                            nonNgStorage: 'this should not be changed',
                            'ngStorage-existing': '"this should not be replaced"'
                        });

                        $storage.$default({
                            existing: 'oops! replaced!',
                            'new': 'new value'
                        });

                        $rootScope.$digest();
                        $timeout.flush();
                    });

                    it('should should add any missing ngStorage- keys on window.' + storageType,
                        function() {

                        expect($window[storageType].data['ngStorage-new'])
                            .to.equal('"new value"');

                    });

                    it('should should add any missing values to $' + storageType, function() {

                        expect($storage['new']).to.equal('new value');

                    });

                    it('should should not modify any existing ngStorage- keys on window.' + storageType,
                        function() {

                        expect($window[storageType].data['ngStorage-existing'])
                            .to.equal('"this should not be replaced"');

                    });

                    it('should should not modify any existing values on $' + storageType, function() {

                        expect($storage['existing'])
                            .to.equal('this should not be replaced');

                    });
                });

                if (storageType == 'localStorage') {

                    describe('when an ngStorage- value in window.localStorage is updated', function() {

                        beforeEach(function() {

                            initStorage({'ngStorage-existing': '"update me"'});

                            var updateEvent = {
                                key: 'ngStorage-existing',
                                newValue: '"updated"'
                            };
                            $window.eventHandlers.storage(updateEvent);
                        });

                        it('should reflect the update', function() {
                            expect($storage.existing).to.equal('updated');
                        });
                    });

                    describe('when an ngStorage- value in window.localStorage is added', function() {

                        beforeEach(function() {

                            initStorage({});

                            var updateEvent = {
                                key: 'ngStorage-value',
                                newValue: '"new"'
                            };
                            $window.eventHandlers.storage(updateEvent);
                        });

                        it('should reflect the addition', function() {
                            expect($storage.value).to.equal('new');
                        });
                    });

                    describe('when an ngStorage- value in window.localStorage is deleted', function() {
                        beforeEach(function() {
                            initStorage({'ngStorage-existing': '"delete me"'});
                            var updateEvent = {
                                key: 'ngStorage-existing',
                            };
                            $window.eventHandlers.storage(updateEvent);
                        });

                        it('should reflect the deletion', function() {
                            expect($storage.existing).to.be.undefined;
                        });
                    });

                    describe("when window.localStorage is not available (safari)", function() {
                        beforeEach(function() {
                            // invalidate storage
                            initStorage({}, function(storage) {
                                storage.setItem = function(id, val) {
                                    throw Error('Not available!');
                                };
                            })
                        });

                        it('should, upon loading, contain a value for each ngStorage- key in window.localStorage', function() {
                            expect(function() {
                                $storage.newKey = 'some value';
                                $rootScope.$digest();
                                $timeout.flush();
                            }).not.to.throw();
                        });

                        it('should, upon loading, contain a value for each ngStorage- key in window.localStorage', function() {
                            expect($storage.$supported).to.be.equal(false);
                        });

                    });
                }
            });

            describe("anything-namespace", function() {
                beforeEach(module('ngStorage', [
                    '$' + storageType + 'Provider',
                    function($storageProvider) {
                        $storageProvider.setPrefix("anything-");
                    }
                ]));

                it('should contain a ' + storageType + ' service', function() {
                    expect(storageType).not.to.equal(null);
                });

                it('should, upon loading, contain a value for each ngStorage- key in window.' +
                    storageType, function() {

                    initStorage({
                        nonNgStorage: 'this should be ingored',
                        'anything-string': '"a string"',
                        'anything-number': '123',
                        'anything-bool': 'true',
                        'anything-object': '{"string":"a string", "number": 123, "bool": true}'
                    });

                    clearStorage($storage);

                    expect($storage).to.deep.equal({
                        string: 'a string',
                        number: 123,
                        bool: true,
                        object: { string:'a string', number: 123, bool: true }
                    });
                });
            });
        });
    }
});


